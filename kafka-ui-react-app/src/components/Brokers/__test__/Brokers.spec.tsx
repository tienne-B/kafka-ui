import React from 'react';
import Brokers from 'components/Brokers/Brokers';
import { render } from 'lib/testHelpers';
import { screen, waitFor } from '@testing-library/dom';
import { Route } from 'react-router';
import { clusterBrokersPath } from 'lib/paths';
import fetchMock from 'fetch-mock';
import { clusterStatsPayload } from 'redux/reducers/brokers/__test__/fixtures';

describe('Brokers Component', () => {
  afterEach(() => fetchMock.reset());

  const clusterName = 'local';
  const renderComponent = () =>
    render(
      <Route path={clusterBrokersPath(':clusterName')}>
        <Brokers />
      </Route>,
      {
        pathname: clusterBrokersPath(clusterName),
      }
    );

  describe('Brokers', () => {
    let fetchBrokersMock: fetchMock.FetchMockStatic;
    const fetchStatsUrl = `/api/clusters/${clusterName}/stats`;

    beforeEach(() => {
      fetchBrokersMock = fetchMock.getOnce(
        `/api/clusters/${clusterName}/brokers`,
        clusterStatsPayload
      );
    });

    it('renders', async () => {
      const fetchStatsMock = fetchMock.getOnce(
        fetchStatsUrl,
        clusterStatsPayload
      );
      renderComponent();
      await waitFor(() => {
        expect(fetchStatsMock.called()).toBeTruthy();
      });
      await waitFor(() => {
        expect(fetchBrokersMock.called()).toBeTruthy();
      });
      expect(screen.getByRole('table')).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows.length).toEqual(3);
    });

    it('shows warning when offlinePartitionCount > 0', async () => {
      const fetchStatsMock = fetchMock.getOnce(fetchStatsUrl, {
        ...clusterStatsPayload,
        offlinePartitionCount: 1345,
      });
      renderComponent();
      await waitFor(() => {
        expect(fetchStatsMock.called()).toBeTruthy();
      });
      await waitFor(() => {
        expect(fetchBrokersMock.called()).toBeTruthy();
      });
      const onlineWidget = screen.getByText(
        clusterStatsPayload.onlinePartitionCount
      );
      expect(onlineWidget).toBeInTheDocument();
      expect(onlineWidget).toHaveStyle({ color: '#E51A1A' });
    });
    it('shows right count when offlinePartitionCount > 0', async () => {
      const fetchStatsMock = fetchMock.getOnce(fetchStatsUrl, {
        ...clusterStatsPayload,
        inSyncReplicasCount: 798,
        outOfSyncReplicasCount: 1,
      });
      renderComponent();
      await waitFor(() => {
        expect(fetchStatsMock.called()).toBeTruthy();
      });

      const onlineWidgetDef = screen.getByText('798');
      const onlineWidget = screen.getByText('of 799');
      // const onlineIcon = screen.getAllByText()
      expect(onlineWidgetDef).toBeInTheDocument();
      expect(onlineWidget).toBeInTheDocument();
    });
    it('shows right count when inSyncReplicasCount: undefined outOfSyncReplicasCount: 1', async () => {
      const fetchStatsMock = fetchMock.getOnce(fetchStatsUrl, {
        ...clusterStatsPayload,
        inSyncReplicasCount: undefined,
        outOfSyncReplicasCount: 1,
      });
      renderComponent();
      await waitFor(() => {
        expect(fetchStatsMock.called()).toBeTruthy();
      });

      const onlineWidget = screen.getByText('of 1');
      expect(onlineWidget).toBeInTheDocument();
    });
    it('shows right count when inSyncReplicasCount: 47 outOfSyncReplicasCount: undefined', async () => {
      const fetchStatsMock = fetchMock.getOnce(fetchStatsUrl, {
        ...clusterStatsPayload,
        inSyncReplicasCount: 47,
        outOfSyncReplicasCount: undefined,
      });
      renderComponent();
      await waitFor(() => {
        expect(fetchStatsMock.called()).toBeTruthy();
      });
      const onlineWidgetDef = screen.getByText('47');
      const onlineWidget = screen.getByText('of 47');
      expect(onlineWidgetDef).toBeInTheDocument();
      expect(onlineWidget).toBeInTheDocument();
    });
  });
});
