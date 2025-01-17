import React, { useEffect, useReducer } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { useIntl } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import { ActionBox } from './ActionBox';
import {
  COMPLETED_STATUS,
  firstStepsReducer,
  FIRST_STEPS_ACTIONS,
  initFirstStepsReducer,
  INITIAL_STATE_FIRST_STEPS,
  PENDING_STATUS,
  UNKNOWN_STATUS,
} from './reducers/firstStepsReducer';

export const FirstSteps = InjectAppServices(({ dependencies: { systemUsageSummary } }) => {
  const [{ firstStepsData, loading }, dispatch] = useReducer(
    firstStepsReducer,
    INITIAL_STATE_FIRST_STEPS,
    initFirstStepsReducer,
  );

  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: FIRST_STEPS_ACTIONS.START_FETCH });
        const { value: data } = await systemUsageSummary.getSystemUsageSummaryData();
        // TODO: define what to do in case of error
        const dataMapped = mapSystemUsageSummary(data);
        dispatch({
          type: FIRST_STEPS_ACTIONS.FINISH_FETCH,
          payload: {
            ...dataMapped,
            firstSteps: dataMapped.firstSteps.filter(
              (firstStep) => firstStep.status !== UNKNOWN_STATUS,
            ),
          },
        });
      } catch (error) {
        dispatch({ type: FIRST_STEPS_ACTIONS.FAIL_FETCH });
      }
    };

    fetchData();
  }, [systemUsageSummary]);

  const { firstSteps } = firstStepsData;

  return (
    <>
      {loading && <Loading />}
      <h2 className="dp-title-col-postcard">
        <span className="dp-icon-steps" />
        {_('dashboard.first_steps.section_name')}
      </h2>
      <ul className="dp-stepper">
        {firstSteps.map((firstStep, index) => (
          <li key={firstStep.titleId}>
            <ActionBox {...firstStep} />
          </li>
        ))}
      </ul>
    </>
  );
});

const isFirstStepsCompleted = (systemUsageSummary) => {
  const { hasListsCreated, hasCampaingsCreated, hasDomainsReady, hasCampaingsSent } =
    systemUsageSummary;

  return (
    hasListsCreated === true &&
    hasCampaingsCreated === true &&
    hasDomainsReady === true &&
    hasCampaingsSent === true
  );
};

const getListCreatedStep = (hasListsCreated) => ({
  status: hasListsCreated
    ? COMPLETED_STATUS
    : hasListsCreated === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: 'dashboard.first_steps.has_list_created_title',
  descriptionId: 'dashboard.first_steps.has_list_created_description_MD',
  textStep: 1,
  trackingId: 'dashboard-firstSteps-line1',
  link: 'dashboard.first_steps.has_list_created_url',
});

const getDomainsReadyStep = (hasDomainsReady) => ({
  status: hasDomainsReady
    ? COMPLETED_STATUS
    : hasDomainsReady === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_domains_ready_title`,
  descriptionId: 'dashboard.first_steps.has_domains_ready_description_MD',
  textStep: 2,
  trackingId: 'dashboard-firstSteps-line2',
  link: 'dashboard.first_steps.has_domains_ready_url',
});

const getCampaingsCreatedStep = (hasCampaingsCreated) => ({
  status: hasCampaingsCreated
    ? COMPLETED_STATUS
    : hasCampaingsCreated === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_campaings_created_title`,
  descriptionId: 'dashboard.first_steps.has_campaings_created_description_MD',
  textStep: 3,
  trackingId: 'dashboard-firstSteps-line3',
  link: 'dashboard.first_steps.has_campaings_created_url',
});

const getCampaingsSentStep = (hasCampaingsSent) => ({
  status: hasCampaingsSent
    ? COMPLETED_STATUS
    : hasCampaingsSent === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_campaings_sent_title`,
  descriptionId: 'dashboard.first_steps.has_campaings_sent_description_MD',
  textStep: 4,
  trackingId: 'dashboard-firstSteps-line4',
  link: 'dashboard.first_steps.has_campaings_sent_url',
});

// TODO: move to service folder to get system usage summary
export const mapSystemUsageSummary = (systemUsageSummary) => {
  const { hasListsCreated, hasCampaingsCreated, hasDomainsReady, hasCampaingsSent } =
    systemUsageSummary;

  return {
    completed: isFirstStepsCompleted(systemUsageSummary),
    firstSteps: [
      getListCreatedStep(hasListsCreated),
      getDomainsReadyStep(hasDomainsReady),
      getCampaingsCreatedStep(hasCampaingsCreated),
      getCampaingsSentStep(hasCampaingsSent),
    ],
  };
};
