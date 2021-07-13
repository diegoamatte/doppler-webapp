import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HeaderUserMenu from './HeaderUserMenu';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

const userData = {
  fullname: 'John Miller',
  email: 'john@doppler.com',
  avatar: {
    color: '#fff',
    text: 'JM',
  },
  plan: {
    remainingCredits: 10000,
    description: 'creditos disponibles',
  },
  sms: {
    description: 'Available for SMS',
    remainingCredits: 450,
    buttonText: 'CHARGE',
    buttonUrl: 'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/GetSmsConfiguration',
  },
  nav: [
    {
      title: 'Panel de Control',
      url: 'https://app2.fromdoppler.com/ControlPanel',
      isEnabled: false,
      isSelected: false,
    },
  ],
};

describe('Header user menu', () => {
  afterEach(cleanup);

  it('renders user menu and display user data', () => {
    // Act
    const { getByText, getAllByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText('John Miller')).toBeInTheDocument();
    expect(getByText('john@doppler.com')).toBeInTheDocument();
    expect(getAllByText('JM')).toHaveLength(2);
    expect(getByText('Panel de Control')).toBeInTheDocument();
  });

  it('user have monhtly plan', () => {
    // Arrange
    userData.plan = {
      isMonthlyByEmail: 'true',
      description: 'Remaining Emails',
      planName: 'Monthly Plan',
      maxSubscribers: 50000,
      buttonText: 'upgrade',
    };

    // Act
    const { getByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText('Monthly Plan')).toBeInTheDocument();
    expect(getByText('upgrade')).toBeInTheDocument();
  });

  it('user is clienManager', () => {
    // Arrange
    userData.plan = {
      clientManager: {},
      buttonUrl: 'https://app2.fromdoppler.com/ControlPanel',
      buttonText: 'Upgrade',
    };

    // Act
    const { getByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText('Upgrade')).toBeInTheDocument();
  });

  it('should show available SMS text when user have SMS enabled', () => {
    // Act
    const { getByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText(userData.sms.description)).toBeInTheDocument();
  });

  it('should not show SMS text when feature is disabled or is not implented yet', () => {
    // Arrange
    userData.sms = {};

    // Act
    const { queryByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(queryByText('Available for SMS')).not.toBeInTheDocument();
  });

  it('Should show SENT REQUESTED when the user has last plan, and he requests a new plan', () => {
    // Arrange
    var userData = {
      fullname: 'John Miller',
      email: 'john@doppler.com',
      isLastPlanRequested: true,
      hasClientManager: false,
      avatar: {
        color: '#fff',
        text: 'JM',
      },
      plan:{
        remainingCredits: 10000,
        description: 'creditos disponibles',
        isSubscribers: true,
        buttonUrl: false,
        pendingFreeUpgrade: false,
      },
      nav: [
        {
          title: 'Panel de Control',
          url: 'https://app2.fromdoppler.com/ControlPanel',
          isEnabled: false,
          isSelected: false,
        },
      ],
      sms:{}
    };

    // Act
    const { getByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText('header.send_request')).toBeInTheDocument();
    expect(getByText('header.tooltip_last_plan')).toBeInTheDocument();
  });

  it('Should NOT show SENT REQUESTED when the user has last plan, and he does not requests a new plan', () => {
    // Act
    const { container } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(container.querySelector('tooltiptext')).toBeNull();
    expect(container.querySelector('dp-request-sent')).toBeNull();
  });
});
