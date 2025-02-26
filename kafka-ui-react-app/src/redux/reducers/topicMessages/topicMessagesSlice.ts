import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TopicMessagesState, ClusterName, TopicName } from 'redux/interfaces';
import { TopicMessage, Configuration, MessagesApi } from 'generated-sources';
import { BASE_PARAMS } from 'lib/constants';
import { getResponse } from 'lib/errorHandling';
import { showSuccessAlert } from 'redux/reducers/alerts/alertsSlice';

const apiClientConf = new Configuration(BASE_PARAMS);
export const messagesApiClient = new MessagesApi(apiClientConf);

export const clearTopicMessages = createAsyncThunk<
  undefined,
  { clusterName: ClusterName; topicName: TopicName; partitions?: number[] }
>(
  'topicMessages/clearTopicMessages',
  async (
    { clusterName, topicName, partitions },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await messagesApiClient.deleteTopicMessages({
        clusterName,
        topicName,
        partitions,
      });

      dispatch(
        showSuccessAlert({
          id: `message-${topicName}-${clusterName}-${partitions}`,
          message: 'Messages successfully cleared!',
        })
      );

      return undefined;
    } catch (err) {
      return rejectWithValue(await getResponse(err as Response));
    }
  }
);

export const initialState: TopicMessagesState = {
  messages: [],
  meta: {
    bytesConsumed: 0,
    elapsedMs: 0,
    messagesConsumed: 0,
    isCancelled: false,
  },
  isFetching: false,
};

export const topicMessagesSlice = createSlice({
  name: 'topicMessages',
  initialState,
  reducers: {
    addTopicMessage: (state, action) => {
      const messages: TopicMessage[] = action.payload.prepend
        ? [action.payload.message, ...state.messages]
        : [...state.messages, action.payload.message];

      return {
        ...state,
        messages,
      };
    },
    resetTopicMessages: () => initialState,
    updateTopicMessagesPhase: (state, action) => {
      state.phase = action.payload;
    },
    updateTopicMessagesMeta: (state, action) => {
      state.meta = action.payload;
    },
    setTopicMessagesFetchingStatus: (state, action) => {
      state.isFetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearTopicMessages.fulfilled, (state) => {
      state.messages = [];
    });
  },
});

export const {
  addTopicMessage,
  resetTopicMessages,
  updateTopicMessagesPhase,
  updateTopicMessagesMeta,
  setTopicMessagesFetchingStatus,
} = topicMessagesSlice.actions;

export default topicMessagesSlice.reducer;
