import {
  ENDPOINTS_DOCUMENT_ID,
  THREADS_APP_ID,
  GRAPHQL_ENDPOINT,
} from './consts';
import { IS_DEBUG } from './env';
import { ThreadsRepliesResponse, ThreadsUserProfileResponse, UserThreadsResponse } from '../types/threads-api';
import { mapThreadsReplies, mapUserProfile, mapUserThreads } from './map';

const fetchBase = ({ documentId, variables }) => {
  return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Threads API midu client',
      'x-ig-app-id': THREADS_APP_ID,
      'x-fb-lsd': 'jdFoLBsUcm9h-j90PeanuC',
    },
    body: `lsd=jdFoLBsUcm9h-j90PeanuC&jazoest=21926&variables=${JSON.stringify(
      variables
    )}&doc_id=${documentId}`,
  }).then((response) => response.json());
};

export const fetchUserIdByName = ({ userName }) => {
  if (IS_DEBUG) console.info(`https://www.threads.net/@${userName}`);

  return fetch(`https://www.threads.net/@${userName}`, {
    headers: { 'sec-fetch-site': 'same-site' },
  })
    .then((res) => res.text())
    .then((html) => {
      const userId = html.match(/"user_id":"(\d+)"/)?.[1];
      return userId;
    });
};

export const fetchUserProfile = async ({
  userId,
  userName,
}: {
  userId?: string;
  userName?: string;
}) => {
  if (userName && !userId) {
    userId = await fetchUserIdByName({ userName });
  }

  const variables = { userID: userId };
  const data = (await fetchBase({
    variables,
    documentId: ENDPOINTS_DOCUMENT_ID.USER_PROFILE,
  })) as ThreadsUserProfileResponse;

  return mapUserProfile(data);
};

export const fetchUserProfileThreads = async ({
  userId,
  userName,
}: {
  userId?: string;
  userName?: string;
}) => {
  if (userName && !userId) {
    userId = await fetchUserIdByName({ userName });
  }

  const variables = { userID: userId };
  const data = (await fetchBase({
    variables,
    documentId: ENDPOINTS_DOCUMENT_ID.USER_PROFILE_THREADS,
  })) as UserThreadsResponse; 

  return mapUserThreads(data);
};

export const fetchUserReplies = async ({
  userId,
  userName,
}: {
  userId?: string;
  userName?: string;
}) => {
  if (userName && !userId) {
    userId = await fetchUserIdByName({ userName });
  }

  const variables = { userID: userId };
  return fetchBase({
    variables,
    documentId: ENDPOINTS_DOCUMENT_ID.USER_REPLIES,
  });
};

export const fetchThreadReplies = async ({ threadId }) => {
  const variables = { postID: threadId };
  const data = (await fetchBase({
    variables,
    documentId: ENDPOINTS_DOCUMENT_ID.USER_PROFILE_THREADS_REPLIES,
  })) as ThreadsRepliesResponse;

  return mapThreadsReplies(data);
};

export const fetchPostReplies = async ({ threadId }) => {
  const variables = { postID: threadId };
  return fetchBase({
    variables,
    documentId: ENDPOINTS_DOCUMENT_ID.THREADS_REPLIES,
  });
};
