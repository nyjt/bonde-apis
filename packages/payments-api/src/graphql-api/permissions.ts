import fetch from './client';
import logger from '../logger';

const CommunityUsersQuery = `
  query CheckPermissions($user_id: Int!, $community_id: Int!) {
    community_users(where: { user_id: { _eq: $user_id }, community_id: { _eq: $community_id } }) {
      role
    }
  }
`;

type Args = {
  user_id: number
  community_id: number
}

type Permission = {
  role: number
}

export const get_permission = async ({ user_id, community_id }: Args): Promise<Permission> => {
  const { data }: any = await fetch({
    query: CommunityUsersQuery,
    variables: { user_id, community_id }
  });

  logger.child({ data }).info('permissions.verify');

  const permission: Permission = data.community_users[0];

  return permission;
}