import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import queryString from 'query-string';
import { extractParameter } from '../../../utils';
import { Loading } from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';
import * as S from './ReportsPartialsCampaigns.styles';

const ReportsPartialsCampaigns = ({ location, dependencies: { dopplerApiClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fechData = async () => {
      setState({ loading: true });
      const campaignId = extractParameter(location, queryString.parse, 'campaignId');
      let response = await dopplerApiClient.getCampaignNameAndSubject(campaignId);
      if (!response.success) {
        setState({ loading: false });
      } else {
        const campaign = response.value;
        response = await dopplerApiClient.getCampaignSummaryResults(campaignId);
        if (!response.success) {
          setState({ loading: false, featureNoAvailable: true });
        } else {
          setState({
            loading: false,
            campaign: campaign,
            campaignSummaryResults: response.value,
          });
        }
      }
    };
    fechData();
  }, [dopplerApiClient, location]);

  return (
    <>
      {state.loading ? (
        <Loading />
      ) : state.featureNoAvailable ? (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="common.feature_no_available" />
        </p>
      ) : !state.campaignSummaryResults ? (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="common.unexpected_error" />
        </p>
      ) : (
        <>
          <FormattedMessage id="reports_partials_campaigns.page_title">
            {(page_title) => (
              <Helmet>
                <title>{page_title}</title>
                <meta
                  name="description"
                  content={_('reports_partials_campaigns.page_description')}
                />
              </Helmet>
            )}
          </FormattedMessage>
          <header className="report-filters">
            <div className="dp-container">
              <div className="dp-rowflex">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <h3>
                    <FormattedMessage id="reports_partials_campaigns.header_title" />
                  </h3>
                  <S.MainReportBox>
                    <span>
                      <strong>
                        <FormattedMessage id="reports_partials_campaigns.campaign_name" />{' '}
                      </strong>
                      {state.campaign.name}
                    </span>
                    <span>
                      <strong>
                        <FormattedMessage id="reports_partials_campaigns.campaign_subject" />{' '}
                      </strong>
                      {state.campaign.subject}
                    </span>
                  </S.MainReportBox>
                  <span className="arrow" />
                </div>
              </div>
            </div>
          </header>
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 col-md-12 col-lg-12 m-t-24">
                <div className="dp-box-shadow">
                  <S.DetailedInformation>
                    <div>
                      <p>
                        <FormattedMessage id="reports_partials_campaigns.campaign_state" />
                      </p>
                      <h2>{state.campaignSummaryResults.campaignStatus}</h2>
                    </div>
                    <div>
                      <p>
                        <FormattedMessage id="reports_partials_campaigns.total_recipients" />{' '}
                      </p>
                      <h2>{state.campaignSummaryResults.totalRecipients}</h2>
                    </div>
                    <div>
                      <p>
                        <FormattedMessage id="reports_partials_campaigns.total_sent_so_far" />
                      </p>
                      <h2>{state.campaignSummaryResults.totalShipped}</h2>
                    </div>
                  </S.DetailedInformation>
                </div>
              </div>
              <div className="col-sm-12 m-t-24 m-b-48">
                <div className="dp-box-shadow">
                  <div className="dp-rowflex">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <S.Header>
                        <h3>
                          <FormattedMessage id="reports_partials_campaigns.delivery_rate" />
                        </h3>
                      </S.Header>
                      <S.Kpi>
                        <div>
                          <h2>{state.campaignSummaryResults.uniqueOpens} </h2>
                          <p>
                            <FormattedMessage id="reports_partials_campaigns.opened" />
                          </p>
                        </div>
                        <div>
                          <h2>{state.campaignSummaryResults.totalUnopened} </h2>
                          <p>
                            <FormattedMessage id="reports_partials_campaigns.not_open" />
                          </p>
                        </div>
                        <div>
                          <h2>
                            {state.campaignSummaryResults.totalHardBounces +
                              state.campaignSummaryResults.totalSoftBounces}
                          </h2>
                          <p>
                            <FormattedMessage id="reports_partials_campaigns.hard_and_soft" />
                          </p>
                        </div>
                      </S.Kpi>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <S.BackGrey>
                        <S.Header>
                          <h3>
                            <FormattedMessage id="reports_partials_campaigns.campaign_summary" />
                          </h3>
                        </S.Header>
                        <S.Summary>
                          <ul>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_subscribers" />{' '}
                              <span>{state.campaignSummaryResults.totalShipped}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.emails_delivered" />{' '}
                              <span>{state.campaignSummaryResults.successFullDeliveries}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_forwarded" />{' '}
                              <span>{state.campaignSummaryResults.timesForwarded}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_openings" />{' '}
                              <span>{state.campaignSummaryResults.totalTimesOpened}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.last_open_date" />{' '}
                              <span>{state.campaignSummaryResults.lastOpenDate}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.unique_clicks" />{' '}
                              <span>{state.campaignSummaryResults.uniqueClicks}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.unique_opens" />{' '}
                              <span>{state.campaignSummaryResults.uniqueOpens}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_clicks" />{' '}
                              <span>{state.campaignSummaryResults.totalClicks}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.last_click_date" />{' '}
                              <span>{state.campaignSummaryResults.lastClickDate}</span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_unsubscribers" />{' '}
                              <span>{state.campaignSummaryResults.totalUnsubscribers}</span>
                            </li>
                          </ul>
                        </S.Summary>
                      </S.BackGrey>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default InjectAppServices(ReportsPartialsCampaigns);