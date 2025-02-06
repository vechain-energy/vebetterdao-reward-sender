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
              logoUrl
            }
          }
        }
      `;

      try {
        const data = await request(API.SUBGRAPH_URL, query);
        setApps(data.apps);
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