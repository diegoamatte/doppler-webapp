import { ResultWithoutExpectedErrors, EmptyResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';

export interface DopplerUserApiClient {
  getContactInformationData(): Promise<ResultWithoutExpectedErrors<ContactInformation>>;
}

interface DopplerUserApiConnectionData {
  jwtToken: string;
  email: string;
}

export interface ContactInformation {
  email: string;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  province: string;
  country?: string;
  zipCode: string;
  phone: string;
  company: string;
  industry: string;
}

export interface BillingInformation {
  sameAddress: boolean;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  province: string;
  countryId?: number;
  zipCode: string;
  phone: string;
  chooseQuestion: string;
  answerQuestion: string;
}

export class HttpDopplerUserApiClient implements DopplerUserApiClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;
  private readonly connectionDataRef: RefObject<AppSession>;

  constructor({
    axiosStatic,
    baseUrl,
    connectionDataRef,
  }: {
    axiosStatic: AxiosStatic;
    baseUrl: string;
    connectionDataRef: RefObject<AppSession>;
  }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: this.baseUrl,
    });
    this.connectionDataRef = connectionDataRef;
  }

  private getDopplerUserApiConnectionData(): DopplerUserApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler User API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      email: connectionData.userData.user.email,
    };
  }

  private mapContactInformation(data: any): ContactInformation {
    return {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      address: data.address,
      city: data.city,
      province: data.province,
      country: data.country,
      zipCode: data.zipCode,
      phone: data.phone,
      company: data.company,
      industry: data.industry,
    };
  }

  private mapBillingInformation(data: any): BillingInformation {
    return data.map((x: any) => ({
      email: x.email,
      firstname: x.firstname,
      lastname: x.lastname,
      address: x.address,
      city: x.city,
      province: x.province,
      country: x.country,
      zipCode: x.zipCode,
      phone: x.phone,
      chooseQuestion: x.chooseQuestion,
      answerQuestion: x.answerQuestion,
    }));
  }

  public async getContactInformationData(): Promise<
    ResultWithoutExpectedErrors<ContactInformation>
  > {
    try {
      const { email, jwtToken } = this.getDopplerUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapContactInformation(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async createOrUpdateContactInformation(
    values: any,
  ): Promise<EmptyResultWithoutExpectedErrors> {
    return { success: true };
  }

  public async getBillingInformationData(): Promise<
    ResultWithoutExpectedErrors<BillingInformation>
  > {
    try {
      const { email, jwtToken } = this.getDopplerUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/current-billing-information`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapBillingInformation(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async updateBillingInformation(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    return { success: true };
  }
}
