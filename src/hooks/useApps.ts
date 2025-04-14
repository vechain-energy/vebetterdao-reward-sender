import { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';
import { AppData } from '../types';
import { API } from '../config';

export function useApps() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      const query = gql`
        query Apps {
          apps(first: 1000, orderBy: name, orderDirection: asc) {
            id
            name
            metadata {
              title
              logoUrl
            }
          }
        }
      `;

      try {
        const data = await request(API.SUBGRAPH_URL, query);
        setApps(data.apps.map(app => ({
          ...app,
          name: app.metadata?.title || app.name
        })).sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch apps'));
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return { apps, loading, error };
}