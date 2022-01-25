CREATE OR REPLACE VIEW public.plips_subscribers_range
 AS
 SELECT p.widget_id,
    date_trunc('day'::text, p.created_at) AS created_at,
    count(*) AS total
   FROM plips p
  GROUP BY (date_trunc('day'::text, p.created_at)), p.widget_id
  ORDER BY p.widget_id;
