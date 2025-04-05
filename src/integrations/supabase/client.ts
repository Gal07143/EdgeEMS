
// Enhanced Supabase client for both real and mock environments
export const supabase = {
  from: (table: string) => ({
    insert: (data: any) => ({ 
      data: null, 
      error: null, 
      select: () => ({
        data: null,
        error: null,
      })
    }),
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        data: null,
        error: null,
        order: (column: string, { ascending = true } = {}) => ({
          limit: (limit: number) => Promise.resolve({ data: [], error: null }),
          range: (start: number, end: number) => Promise.resolve({ data: [], error: null }),
          data: null,
          error: null,
        }),
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        range: (start: number, end: number) => Promise.resolve({ data: [], error: null }),
        or: (filter: string) => ({
          data: null,
          error: null,
          order: (column: string, { ascending = true } = {}) => ({
            limit: (limit: number) => Promise.resolve({ data: [], error: null }),
            data: null,
            error: null,
          }),
        }),
        gte: (column: string, value: any) => ({
          data: null,
          error: null,
        }),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        data: null,
        error: null,
      }),
      limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      range: (start: number, end: number) => Promise.resolve({ data: [], error: null }),
      distinct: (column: string) => Promise.resolve({ data: [], error: null }),
    }),
    update: (data: any) => ({ 
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      data: null, 
      error: null,
    }),
    delete: () => ({ 
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      data: null, 
      error: null,
    }),
    upsert: (data: any) => Promise.resolve({ data: null, error: null }),
  }),
  channel: (name: string) => ({
    on: (event: string, filter: string, callback: Function) => ({
      subscribe: (cb: Function = () => {}) => {
        cb();
        return {
          unsubscribe: () => {}
        };
      }
    }),
  }),
  removeChannel: (channel: any) => {},
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signIn: (params: any) => Promise.resolve({ data: null, error: null }),
    signUp: (params: any) => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  functions: {
    invoke: (name: string, options: any = {}) => Promise.resolve({ data: null, error: null }),
  },
};

export default supabase;
