import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';

/** Extract the page parameter from url*/
function extractEmail(location) {
  const parsedQuery = location && location.search && queryString.parse(location.search);
  return (parsedQuery && parsedQuery['email']) || null;
}

const CampaignsHistory = ({ location, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });

  const getSubscriberStatusCssClassName = (status) => {
    let subscriberCssClass = '';
    switch (status) {
      case 'active':
        subscriberCssClass = 'user--active';
        break;
      case 'inactive':
        subscriberCssClass = 'user--active-with-no-list';
        break;
      case 'unsubscribed_by_hard':
        subscriberCssClass = 'user--removed-hard-bounced';
        break;
      case 'unsubscribed_by_soft':
        subscriberCssClass = 'user--removed-soft-bounced';
        break;
      case 'unsubscribed_by_subscriber':
        subscriberCssClass = 'user--removed-subscriber';
        break;
      case 'unsubscribed_by_never_open':
        subscriberCssClass = 'user--removed-no-openings';
        break;
      case 'pending':
        subscriberCssClass = 'user--pending';
        break;
      case 'unsubscribed_by_client':
        subscriberCssClass = 'user--removed-client';
        break;
      case 'stand_by':
        subscriberCssClass = 'user--stand-by';
        break;
      default:
        break;
    }
    return subscriberCssClass;
  };

  useEffect(() => {
    const fetchData = async () => {
      const email = extractEmail(location);
      const responseSubscriber = await dopplerApiClient.getSubscriber(email);
      if (responseSubscriber.success) {
        const subscriber = {
          ...responseSubscriber.value,
          firstName: responseSubscriber.value.fields.find((x) => x.name === 'FIRSTNAME'),
          lastName: responseSubscriber.value.fields.find((x) => x.name === 'LASTNAME'),
        };
        const response = await dopplerApiClient.getSubscriberSentCampaigns(email);
        if (!response.success) {
          setState({ loading: false });
        } else {
          setState({ loading: false, sentCampaigns: response.value, subscriber: subscriber });
        }
      } else {
        setState({ loading: false });
      }
    };
    fetchData();
  }, [dopplerApiClient, location]);

  return state.loading ? (
    <Loading />
  ) : state.sentCampaigns ? (
    <section className="dp-container">
      <div className="dp-rowflex">
        <div className="col-sm-12 m-t-24">
          <h2>
            {state.subscriber.email}
            {/*TODO implementation {state.subscriber.score} */}
          </h2>
          <p>
            {state.subscriber.firstName ? state.subscriber.firstName.value : ''}{' '}
            {state.subscriber.lastName ? state.subscriber.lastName.value : ''}
          </p>
          <p>
            {/* the style it's temporal because there is a bug in the styles */}
            <span
              style={{ position: 'relative', 'margin-right': '20px', 'vertical-align': 'super' }}
              className={getSubscriberStatusCssClassName(state.subscriber.status)}
            ></span>
            <FormattedMessage id={'campaign_history.status.' + state.subscriber.status} />
          </p>
        </div>
        <div className="col-sm-12 dp-block-wlp m-b-36">
          <div className="dp-table-responsive">
            <table
              className="dp-c-table"
              aria-label="Resultado de historial de suscriptores"
              summary="Resultado de historial de suscriptores"
            >
              <thead>
                <tr>
                  <th scope="col">
                    <FormattedMessage id="subscriber_history_sent_campaigns.grid_campaign" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="subscriber_history_sent_campaigns.grid_subject" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="subscriber_history_sent_campaigns.grid_delivery" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="subscriber_history_sent_campaigns.grid_clicks" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.sentCampaigns.items.length ? (
                  state.sentCampaigns.items.map((campaign, index) => (
                    <tr key={index}>
                      <td>{campaign.campaignName}</td>
                      <td>{campaign.campaignSubject}</td>
                      <td>{campaign.deliveryStatus}</td>
                      <td>{campaign.clicksCount}</td>
                    </tr>
                  ))
                ) : (
                  <p className="dp-boxshadow--usermsg bounceIn">
                    <FormattedMessage id="common.empty_data" />
                  </p>
                )}
                {}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <p className="dp-boxshadow--error bounceIn">
      <FormattedMessage id="common.unexpected_error" />
    </p>
  );
};

export default InjectAppServices(CampaignsHistory);
