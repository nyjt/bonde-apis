import fetch from './client';
import logger from '../logger';
import { HasuraTicket } from "../types"

export const queries = {
  create_ticket: `  
    mutation CreateSolidarityTicket($tickets: [solidarity_tickets_insert_input!]!) {
      insert_solidarity_tickets(
        objects: $tickets
        on_conflict: {
          constraint: solidarity_tickets_ticket_id_key
          update_columns: [
            status
            assignee_id
            custom_fields
            tags
            updated_at
            link_match
            data_encaminhamento
            nome_voluntaria
            status_acolhimento
            match_syncronized
          ]
        }
      ) {
        returning {
          external_id
          requester_id
          submitter_id
          assignee_id
          status
          subject
          organization_id
          nome_msr
          link_match
          status_acolhimento
          data_encaminhamento
          custom_fields
        }
      }
    }
  `,
  update_ticket: `
    mutation UpdateSolidarityTicket(
      $ticket: solidarity_tickets_set_input
      $ids: [bigint!]
    ) {
      update_solidarity_tickets(
        _set: $ticket
        where: { ticket_id: { _in: $ids } }
      ) {
        returning {
          ticket_id
        }
      }
    }
  `
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const update = async (ticket: HasuraTicket, ids: number[]): Promise<{ ticket_id: number }[]> => {   
  const { data, ...props } = await fetch({
    query: queries.update_ticket,
    variables: { ids, ticket }
  });

  logger.child({ props }).info('update_ticket');

  return data.update_solidarity_tickets.returning;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const create = async (tickets: any): Promise<Array<any>> => {
  const { data, ...props } = await fetch({
    query: queries.create_ticket,
    variables: { tickets }
  });

  logger.child({ props }).info('create_ticket');

  return data.insert_solidarity_tickets.returning;
};
