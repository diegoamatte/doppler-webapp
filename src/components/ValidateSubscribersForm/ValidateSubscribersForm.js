import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import {
    FieldGroup,
    SubmitButton,
    FieldItem,
    InputFieldItem
} from '../form-helpers/form-helpers';
import { Loading } from '../../components/Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Form, Field } from 'formik';

/** @type { import('../../services/doppler-legacy-client').DopplerLegacyClient } */
const ValidateSubscribersForm = ({
    handleClose,
    dependencies: { dopplerLegacyClient },
}) => {
    const [state, setState] = useState({
        dataForm: null,
        urlHelp: null,
        isLoading: true,
        toggleOthers: false
    });
    const otherCheckboxValue = useIntl().formatMessage({ id: 'validateSubscribersForm.others' })

    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const onSubmit = async (values) => {
        console.log(values);
        // const response = await dopplerLegacyClient.sendSubscriberValidation(values);
        // console.log(response);
    }


    const validate = (values) => {
        const errors = {};
        values.questionsList.forEach((question, index) =>{
            if(!question.answer.value){
                const fieldname = `questionsList[${index}].answer.value`;
                errors[fieldname] = 'validation_messages.error_required_field';
            }
        });
        // if (!values[fieldNames.message] && values[fieldNames.selectedPlanId] === null) {
        //   errors[fieldNames.message] = 'validation_messages.error_required_field';
        // }
        return errors;
    };

    useEffect(() => {
        const fetchData = async () => {
            const validateSubscribersFormData = await dopplerLegacyClient.getSubscriberValidationFormData();
            setState({
                dataForm: validateSubscribersFormData,
                urlHelp: validateSubscribersFormData.urlHelp,
                isLoading: false,
            });
        };
        fetchData();
    }, [dopplerLegacyClient]);

    const toggleOthers = (event) => {
        if (event.target.value === otherCheckboxValue) {
            setState({ toggleOthers: !state.toggleOthers })
        }
    }

    const renderTextfield = (questionItem, index) => {
        return (
            <InputFieldItem
                type="text"
                fieldName={`questionsList[${index}].answer.value`}
                label={questionItem.question}
                id={questionItem.question}
                withNameValidation
                required
                className={`${questionItem.answer?.answerType === 'TEXTFIELD' ? 'field-item--50' : 'field-item'}`}
            />
        );
    }

    const renderCheckbox = (questionItem, index) => {
        return (
            <>
                <label htmlFor={questionItem.question}>
                    {questionItem.question}
                </label>
                {
                    questionItem.answer.answerOptions.map(
                        (option, optionIndex) => (
                            <>
                                <li className={'field-item field-item__checkbox field-item--50'}>
                                    <Field
                                        type="checkbox"
                                        name={`questionsList[${index}].answer.optionsSelected`}
                                        value={option}
                                        onClick={toggleOthers}
                                    />
                                    <label htmlFor={`questionsList[${index}].answer.optionsSelected`}>
                                        {option}
                                    </label>
                                </li>
                                {
                                    questionItem.answer.answerOptions.length - 1 === optionIndex && questionItem.answer.answerType == "CHECKBOX_WITH_TEXTAREA" ? (
                                        <div className={`${state.toggleOthers ? 'dp-show' : 'dp-hide'}`}>
                                            <Field
                                                as="textarea"
                                                maxLength="140"
                                                name={`questionsList[${index}].answer.value`}
                                            />
                                        </div>
                                    ) : <></>
                                }
                            </>
                        )
                    )
                }
            </>

        );
    }

    const renderQuestionsList = (questionsList) => {
        const questions = questionsList.map((questionItem, questionIndex) => {
            const answerType = questionItem.answer?.answerType;
            if (answerType == "TEXTFIELD" || answerType == "URL") {
                return renderTextfield(questionItem, questionIndex);
            }
            else if (answerType == "CHECKBOX" || "CHECKBOX_WITH_TEXTFIELD") {
                return renderCheckbox(questionItem, questionIndex);
            }
        })
        return questions;
    }

    return state.isLoading ? (
        <Loading />
    ) : (
        <div>
            <h2 className="modal-title">
                <FormattedMessage id="validateSubscribersForm.title" />
            </h2>
            <p style={{ color: "#666" }}>
                <FormattedMessage id="validateSubscribersForm.subtitle" />
            </p>
            <Formik
                initialValues={state.dataForm}
                // validate={validate}
                onSubmit={onSubmit}
            >
                {({ values, errors, touched, submitCount }) => (
                    <Form className="form-request">
         
                        <fieldset>
                            <FieldGroup>
                                {renderQuestionsList(values.questionsList)}
                                <FieldItem className="field-item">
                                    <div style={{ display: "inline-block" }}>
                                        <p style={{ color: "#666" }}><i><FormattedMessage id="validateSubscribersForm.form_help" /> <a target="_BLANK" href={state.urlHelp}><FormattedMessage id="validateSubscribersForm.form_help_link_text" /></a></i></p>
                                        <p style={{ color: "#666" }}><i><FormattedMessage id="validateSubscribersForm.info_text" /></i></p>
                                    </div>
                                </FieldItem>
                                <FieldItem className="field-item">
                                    <div className="container-buttons">
                                        <button className="dp-button button-medium primary-grey" onClick={handleClose}>
                                            <FormattedMessage id="common.cancel" />
                                        </button>
                                        <SubmitButton className="dp-button button-medium primary-green">
                                            {_('common.save')}
                                        </SubmitButton>
                                    </div>
                                </FieldItem>
                            </FieldGroup>
                        </fieldset>
                    </Form>
                )}
            </Formik>
        </div>
    )
};

export default InjectAppServices(ValidateSubscribersForm);
