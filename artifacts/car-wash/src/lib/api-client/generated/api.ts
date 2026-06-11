import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  AdminUser,
  Booking,
  BookingInput,
  BookingUpdate,
  BusinessSettings,
  ChartPoint,
  DashboardStats,
  ErrorEnvelope,
  GetAvailableSlotsParams,
  GetBookingsChartParams,
  HealthStatus,
  ListBookingsParams,
  LoginBody,
  LoginResponse,
  Review,
  ReviewInput,
  Service,
  ServiceInput,
  TimeSlot,
  TopService,
  UploadUrlRequest,
  UploadUrlResponse
} from './api.schemas';

import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';

type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getHealthCheckUrl = () => `/api/healthz`;

export const healthCheck = async (options?: RequestInit): Promise<HealthStatus> => {
  return customFetch<HealthStatus>(getHealthCheckUrl(), { ...options, method: 'GET' });
};

export const getHealthCheckQueryKey = () => [`/api/healthz`] as const;

export const getHealthCheckQueryOptions = <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) => healthCheck({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & { queryKey: QueryKey };
};

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;

export function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getHealthCheckQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getAdminLoginUrl = () => `/api/auth/login`;

export const adminLogin = async (loginBody: LoginBody, options?: RequestInit): Promise<LoginResponse> => {
  return customFetch<LoginResponse>(getAdminLoginUrl(), { ...options, method: 'POST', headers: { 'Content-Type': 'application/json', ...options?.headers }, body: JSON.stringify(loginBody) });
};

export const getAdminLoginMutationOptions = <TError = ErrorType<void>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, { data: BodyType<LoginBody> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, { data: BodyType<LoginBody> }, TContext> => {
  const mutationKey = ['adminLogin'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminLogin>>, { data: BodyType<LoginBody> }> = (props) => { const { data } = props ?? {}; return adminLogin(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<LoginBody>;
export type AdminLoginMutationError = ErrorType<void>;

export const useAdminLogin = <TError = ErrorType<void>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, { data: BodyType<LoginBody> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, { data: BodyType<LoginBody> }, TContext> => {
  return useMutation(getAdminLoginMutationOptions(options));
};

export const getAdminLogoutUrl = () => `/api/auth/logout`;

export const adminLogout = async (options?: RequestInit): Promise<void> => {
  return customFetch<void>(getAdminLogoutUrl(), { ...options, method: 'POST' });
};

export const getAdminLogoutMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext> => {
  const mutationKey = ['adminLogout'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminLogout>>, void> = () => { return adminLogout(requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;

export const useAdminLogout = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext> => {
  return useMutation(getAdminLogoutMutationOptions(options));
};

export const getGetAdminMeUrl = () => `/api/auth/me`;

export const getAdminMe = async (options?: RequestInit): Promise<AdminUser> => {
  return customFetch<AdminUser>(getGetAdminMeUrl(), { ...options, method: 'GET' });
};

export const getGetAdminMeQueryKey = () => [`/api/auth/me`] as const;

export const getGetAdminMeQueryOptions = <TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<void>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetAdminMeQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAdminMe>>> = ({ signal }) => getAdminMe({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData> & { queryKey: QueryKey };
};

export type GetAdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminMe>>>;
export type GetAdminMeQueryError = ErrorType<void>;

export function useGetAdminMe<TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<void>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetAdminMeQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getListServicesUrl = () => `/api/services`;

export const listServices = async (options?: RequestInit): Promise<Service[]> => {
  return customFetch<Service[]>(getListServicesUrl(), { ...options, method: 'GET' });
};

export const getListServicesQueryKey = () => [`/api/services`] as const;

export const getListServicesQueryOptions = <TData = Awaited<ReturnType<typeof listServices>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListServicesQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listServices>>> = ({ signal }) => listServices({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData> & { queryKey: QueryKey };
};

export type ListServicesQueryResult = NonNullable<Awaited<ReturnType<typeof listServices>>>;
export type ListServicesQueryError = ErrorType<unknown>;

export function useListServices<TData = Awaited<ReturnType<typeof listServices>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListServicesQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getCreateServiceUrl = () => `/api/services`;

export const createService = async (serviceInput: ServiceInput, options?: RequestInit): Promise<Service> => {
  return customFetch<Service>(getCreateServiceUrl(), { ...options, method: 'POST', headers: { 'Content-Type': 'application/json', ...options?.headers }, body: JSON.stringify(serviceInput) });
};

export const getCreateServiceMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof createService>>, TError, { data: BodyType<ServiceInput> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof createService>>, TError, { data: BodyType<ServiceInput> }, TContext> => {
  const mutationKey = ['createService'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof createService>>, { data: BodyType<ServiceInput> }> = (props) => { const { data } = props ?? {}; return createService(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type CreateServiceMutationResult = NonNullable<Awaited<ReturnType<typeof createService>>>;
export type CreateServiceMutationBody = BodyType<ServiceInput>;
export type CreateServiceMutationError = ErrorType<unknown>;

export const useCreateService = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof createService>>, TError, { data: BodyType<ServiceInput> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof createService>>, TError, { data: BodyType<ServiceInput> }, TContext> => {
  return useMutation(getCreateServiceMutationOptions(options));
};

export const getGetServiceUrl = (id: number) => `/api/services/${id}`;

export const getService = async (id: number, options?: RequestInit): Promise<Service> => {
  return customFetch<Service>(getGetServiceUrl(id), { ...options, method: 'GET' });
};

export const getGetServiceQueryKey = (id: number) => [`/api/services/${id}`] as const;

export const getGetServiceQueryOptions = <TData = Awaited<ReturnType<typeof getService>>, TError = ErrorType<unknown>>(id: number, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetServiceQueryKey(id);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getService>>> = ({ signal }) => getService(id, { signal, ...requestOptions });
  return { queryKey, queryFn, enabled: !!(id), ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData> & { queryKey: QueryKey };
};

export type GetServiceQueryResult = NonNullable<Awaited<ReturnType<typeof getService>>>;
export type GetServiceQueryError = ErrorType<unknown>;

export function useGetService<TData = Awaited<ReturnType<typeof getService>>, TError = ErrorType<unknown>>(id: number, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetServiceQueryOptions(id, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getUpdateServiceUrl = (id: number) => `/api/services/${id}`;

export const updateService = async (id: number, serviceInput: ServiceInput, options?: RequestInit): Promise<Service> => {
  return customFetch<Service>(getUpdateServiceUrl(id), { ...options, method: 'PUT', headers: { 'Content-Type': 'application/json', ...options?.headers }, body: JSON.stringify(serviceInput) });
};

export const getUpdateServiceMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateService>>, TError, { id: number; data: BodyType<ServiceInput> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof updateService>>, TError, { id: number; data: BodyType<ServiceInput> }, TContext> => {
  const mutationKey = ['updateService'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateService>>, { id: number; data: BodyType<ServiceInput> }> = (props) => { const { id, data } = props ?? {}; return updateService(id, data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type UpdateServiceMutationResult = NonNullable<Awaited<ReturnType<typeof updateService>>>;
export type UpdateServiceMutationBody = BodyType<ServiceInput>;
export type UpdateServiceMutationError = ErrorType<unknown>;

export const useUpdateService = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateService>>, TError, { id: number; data: BodyType<ServiceInput> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof updateService>>, TError, { id: number; data: BodyType<ServiceInput> }, TContext> => {
  return useMutation(getUpdateServiceMutationOptions(options));
};

export const getDeleteServiceUrl = (id: number) => `/api/services/${id}`;

export const deleteService = async (id: number, options?: RequestInit): Promise<void> => {
  return customFetch<void>(getDeleteServiceUrl(id), { ...options, method: 'DELETE' });
};

export const getDeleteServiceMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteService>>, TError, { id: number }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof deleteService>>, TError, { id: number }, TContext> => {
  const mutationKey = ['deleteService'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteService>>, { id: number }> = (props) => { const { id } = props ?? {}; return deleteService(id, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type DeleteServiceMutationResult = NonNullable<Awaited<ReturnType<typeof deleteService>>>;
export type DeleteServiceMutationError = ErrorType<unknown>;

export const useDeleteService = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteService>>, TError, { id: number }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof deleteService>>, TError, { id: number }, TContext> => {
  return useMutation(getDeleteServiceMutationOptions(options));
};

export const getListBookingsUrl = (params?: ListBookingsParams) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => { if (value !== undefined) normalizedParams.append(key, value === null ? 'null' : value.toString()); });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `/api/bookings?${stringifiedParams}` : `/api/bookings`;
};

export const listBookings = async (params?: ListBookingsParams, options?: RequestInit): Promise<Booking[]> => {
  return customFetch<Booking[]>(getListBookingsUrl(params), { ...options, method: 'GET' });
};

export const getListBookingsQueryKey = (params?: ListBookingsParams) => [`/api/bookings`, ...(params ? [params] : [])] as const;

export const getListBookingsQueryOptions = <TData = Awaited<ReturnType<typeof listBookings>>, TError = ErrorType<unknown>>(params?: ListBookingsParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listBookings>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListBookingsQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listBookings>>> = ({ signal }) => listBookings(params, { signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof listBookings>>, TError, TData> & { queryKey: QueryKey };
};

export type ListBookingsQueryResult = NonNullable<Awaited<ReturnType<typeof listBookings>>>;
export type ListBookingsQueryError = ErrorType<unknown>;

export function useListBookings<TData = Awaited<ReturnType<typeof listBookings>>, TError = ErrorType<unknown>>(params?: ListBookingsParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listBookings>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListBookingsQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getCreateBookingUrl = () => `/api/bookings`;

export const createBooking = async (bookingInput: BookingInput, options?: RequestInit): Promise<Booking> => {
  return customFetch<Booking>(getCreateBookingUrl(), { ...options, method: 'POST', headers: { 'Content-Type': 'application/json', ...options?.headers }, body: JSON.stringify(bookingInput) });
};

export const getCreateBookingMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBooking>>, TError, { data: BodyType<BookingInput> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof createBooking>>, TError, { data: BodyType<BookingInput> }, TContext> => {
  const mutationKey = ['createBooking'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof createBooking>>, { data: BodyType<BookingInput> }> = (props) => { const { data } = props ?? {}; return createBooking(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type CreateBookingMutationResult = NonNullable<Awaited<ReturnType<typeof createBooking>>>;
export type CreateBookingMutationBody = BodyType<BookingInput>;
export type CreateBookingMutationError = ErrorType<unknown>;

export const useCreateBooking = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBooking>>, TError, { data: BodyType<BookingInput> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof createBooking>>, TError, { data: BodyType<BookingInput> }, TContext> => {
  return useMutation(getCreateBookingMutationOptions(options));
};

export const getGetBookingUrl = (id: number) => `/api/bookings/${id}`;

export const getBooking = async (id: number, options?: RequestInit): Promise<Booking> => {
  return customFetch<Booking>(getGetBookingUrl(id), { ...options, method: 'GET' });
};

export const getGetBookingQueryKey = (id: number) => [`/api/bookings/${id}`] as const;

export const getGetBookingQueryOptions = <TData = Awaited<ReturnType<typeof getBooking>>, TError = ErrorType<unknown>>(id: number, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getBooking>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetBookingQueryKey(id);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBooking>>> = ({ signal }) => getBooking(id, { signal, ...requestOptions });
  return { queryKey, queryFn, enabled: !!(id), ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getBooking>>, TError, TData> & { queryKey: QueryKey };
};

export type GetBookingQueryResult = NonNullable<Awaited<ReturnType<typeof getBooking>>>;
export type GetBookingQueryError = ErrorType<unknown>;

export function useGetBooking<TData = Awaited<ReturnType<typeof getBooking>>, TError = ErrorType<unknown>>(id: number, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getBooking>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBookingQueryOptions(id, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getUpdateBookingUrl = (id: number) => `/api/bookings/${id}`;

export const updateBooking = async (id: number, bookingUpdate: BookingUpdate, options?: RequestInit): Promise<Booking> => {
  return customFetch<Booking>(getUpdateBookingUrl(id), { ...options, method: 'PUT', headers: { 'Content-Type': 'application/json', ...options?.headers }, body: JSON.stringify(bookingUpdate) });
};

export const getUpdateBookingMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBooking>>, TError, { id: number; data: BodyType<BookingUpdate> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof updateBooking>>, TError, { id: number; data: BodyType<BookingUpdate> }, TContext> => {
  const mutationKey = ['updateBooking'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateBooking>>, { id: number; data: BodyType<BookingUpdate> }> = (props) => { const { id, data } = props ?? {}; return updateBooking(id, data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type UpdateBookingMutationResult = NonNullable<Awaited<ReturnType<typeof updateBooking>>>;
export type UpdateBookingMutationBody = BodyType<BookingUpdate>;
export type UpdateBookingMutationError = ErrorType<unknown>;

export const useUpdateBooking = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBooking>>, TError, { id: number; data: BodyType<BookingUpdate> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof updateBooking>>, TError, { id: number; data: BodyType<BookingUpdate> }, TContext> => {
  return useMutation(getUpdateBookingMutationOptions(options));
};

export const getDeleteBookingUrl = (id: number) => `/api/bookings/${id}`;

export const deleteBooking = async (id: number, options?: RequestInit): Promise<void> => {
  return customFetch<void>(getDeleteBookingUrl(id), { ...options, method: 'DELETE' });
};

export const getDeleteBookingMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBooking>>, TError, { id: number }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof deleteBooking>>, TError, { id: number }, TContext> => {
  const mutationKey = ['deleteBooking'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteBooking>>, { id: number }> = (props) => { const { id } = props ?? {}; return deleteBooking(id, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type DeleteBookingMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBooking>>>;
export type DeleteBookingMutationError = ErrorType<unknown>;

export const useDeleteBooking = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBooking>>, TError, { id: number }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof deleteBooking>>, TError, { id: number }, TContext> => {
  return useMutation(getDeleteBookingMutationOptions(options));
};

export const getGetAvailableSlotsUrl = (params: GetAvailableSlotsParams) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => { if (value !== undefined) normalizedParams.append(key, value === null ? 'null' : value.toString()); });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `/api/bookings/slots?${stringifiedParams}` : `/api/bookings/slots`;
};

export const getAvailableSlots = async (params: GetAvailableSlotsParams, options?: RequestInit): Promise<TimeSlot[]> => {
  return customFetch<TimeSlot[]>(getGetAvailableSlotsUrl(params), { ...options, method: 'GET' });
};

export const getGetAvailableSlotsQueryKey = (params?: GetAvailableSlotsParams) => [`/api/bookings/slots`, ...(params ? [params] : [])] as const;

export const getGetAvailableSlotsQueryOptions = <TData = Awaited<ReturnType<typeof getAvailableSlots>>, TError = ErrorType<unknown>>(params: GetAvailableSlotsParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getAvailableSlots>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetAvailableSlotsQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAvailableSlots>>> = ({ signal }) => getAvailableSlots(params, { signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getAvailableSlots>>, TError, TData> & { queryKey: QueryKey };
};

export type GetAvailableSlotsQueryResult = NonNullable<Awaited<ReturnType<typeof getAvailableSlots>>>;
export type GetAvailableSlotsQueryError = ErrorType<unknown>;

export function useGetAvailableSlots<TData = Awaited<ReturnType<typeof getAvailableSlots>>, TError = ErrorType<unknown>>(params: GetAvailableSlotsParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getAvailableSlots>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetAvailableSlotsQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getListReviewsUrl = () => `/api/reviews`;

export const listReviews = async (options?: RequestInit): Promise<Review[]> => {
  return customFetch<Review[]>(getListReviewsUrl(), { ...options, method: 'GET' });
};

export const getListReviewsQueryKey = () => [`/api/reviews`] as const;

export const getListReviewsQueryOptions = <TData = Awaited<ReturnType<typeof listReviews>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listReviews>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListReviewsQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listReviews>>> = ({ signal }) => listReviews({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof listReviews>>, TError, TData> & { queryKey: QueryKey };
};

export type ListReviewsQueryResult = NonNullable<Awaited<ReturnType<typeof listReviews>>>;
export type ListReviewsQueryError = ErrorType<unknown>;

export function useListReviews<TData = Awaited<ReturnType<typeof listReviews>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof listReviews>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListReviewsQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getCreateReviewUrl = () => `/api/reviews`;

export const createReview = async (reviewInput: ReviewInput, options?: RequestInit): Promise<Review> => {
  return customFetch<Review>(getCreateReviewUrl(), { ...options, method: 'POST', headers: { 'Content-Type': 'application/json', ...options?.headers }, body: JSON.stringify(reviewInput) });
};

export const getCreateReviewMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, { data: BodyType<ReviewInput> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, { data: BodyType<ReviewInput> }, TContext> => {
  const mutationKey = ['createReview'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof createReview>>, { data: BodyType<ReviewInput> }> = (props) => { const { data } = props ?? {}; return createReview(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type CreateReviewMutationResult = NonNullable<Awaited<ReturnType<typeof createReview>>>;
export type CreateReviewMutationBody = BodyType<ReviewInput>;
export type CreateReviewMutationError = ErrorType<unknown>;

export const useCreateReview = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, { data: BodyType<ReviewInput> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof createReview>>, TError, { data: BodyType<ReviewInput> }, TContext> => {
  return useMutation(getCreateReviewMutationOptions(options));
};

export const getGetDashboardStatsUrl = () => `/api/analytics/dashboard`;

export const getDashboardStats = async (options?: RequestInit): Promise<DashboardStats> => {
  return customFetch<DashboardStats>(getGetDashboardStatsUrl(), { ...options, method: 'GET' });
};

export const getGetDashboardStatsQueryKey = () => [`/api/analytics/dashboard`] as const;

export const getGetDashboardStatsQueryOptions = <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetDashboardStatsQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDashboardStats>>> = ({ signal }) => getDashboardStats({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & { queryKey: QueryKey };
};

export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;

export function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetDashboardStatsQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetBookingsChartUrl = (params?: GetBookingsChartParams) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => { if (value !== undefined) normalizedParams.append(key, value === null ? 'null' : value.toString()); });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `/api/analytics/bookings-chart?${stringifiedParams}` : `/api/analytics/bookings-chart`;
};

export const getBookingsChart = async (params?: GetBookingsChartParams, options?: RequestInit): Promise<ChartPoint[]> => {
  return customFetch<ChartPoint[]>(getGetBookingsChartUrl(params), { ...options, method: 'GET' });
};

export const getGetBookingsChartQueryKey = (params?: GetBookingsChartParams) => [`/api/analytics/bookings-chart`, ...(params ? [params] : [])] as const;

export const getGetBookingsChartQueryOptions = <TData = Awaited<ReturnType<typeof getBookingsChart>>, TError = ErrorType<unknown>>(params?: GetBookingsChartParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getBookingsChart>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetBookingsChartQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBookingsChart>>> = ({ signal }) => getBookingsChart(params, { signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getBookingsChart>>, TError, TData> & { queryKey: QueryKey };
};

export type GetBookingsChartQueryResult = NonNullable<Awaited<ReturnType<typeof getBookingsChart>>>;
export type GetBookingsChartQueryError = ErrorType<unknown>;

export function useGetBookingsChart<TData = Awaited<ReturnType<typeof getBookingsChart>>, TError = ErrorType<unknown>>(params?: GetBookingsChartParams, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getBookingsChart>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBookingsChartQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetTopServicesUrl = () => `/api/analytics/top-services`;

export const getTopServices = async (options?: RequestInit): Promise<TopService[]> => {
  return customFetch<TopService[]>(getGetTopServicesUrl(), { ...options, method: 'GET' });
};

export const getGetTopServicesQueryKey = () => [`/api/analytics/top-services`] as const;

export const getGetTopServicesQueryOptions = <TData = Awaited<ReturnType<typeof getTopServices>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTopServices>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTopServicesQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTopServices>>> = ({ signal }) => getTopServices({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getTopServices>>, TError, TData> & { queryKey: QueryKey };
};

export type GetTopServicesQueryResult = NonNullable<Awaited<ReturnType<typeof getTopServices>>>;
export type GetTopServicesQueryError = ErrorType<unknown>;

export function useGetTopServices<TData = Awaited<ReturnType<typeof getTopServices>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTopServices>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetTopServicesQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetSettingsUrl = () => `/api/settings`;

export const getSettings = async (options?: RequestInit): Promise<BusinessSettings> => {
  return customFetch<BusinessSettings>(getGetSettingsUrl(), { ...options, method: 'GET' });
};

export const getGetSettingsQueryKey = () => [`/api/settings`] as const;

export const getGetSettingsQueryOptions = <TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSettingsQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSettings>>> = ({ signal }) => getSettings({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData> & { queryKey: QueryKey };
};

export type GetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSettings>>>;
export type GetSettingsQueryError = ErrorType<unknown>;

export function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetSettingsQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getUpdateSettingsUrl = () => `/api/settings`;

export const updateSettings = async (businessSettings: BusinessSettings, options?: RequestInit): Promise<BusinessSettings> => {
  return customFetch<BusinessSettings>(getUpdateSettingsUrl(), { ...options, method: 'PUT', headers: { 'Content-Type': 'application/json', ...options?.headers }, body: JSON.stringify(businessSettings) });
};

export const getUpdateSettingsMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, { data: BodyType<BusinessSettings> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, { data: BodyType<BusinessSettings> }, TContext> => {
  const mutationKey = ['updateSettings'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateSettings>>, { data: BodyType<BusinessSettings> }> = (props) => { const { data } = props ?? {}; return updateSettings(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type UpdateSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSettings>>>;
export type UpdateSettingsMutationBody = BodyType<BusinessSettings>;
export type UpdateSettingsMutationError = ErrorType<unknown>;

export const useUpdateSettings = <TError = ErrorType<unknown>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, { data: BodyType<BusinessSettings> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof updateSettings>>, TError, { data: BodyType<BusinessSettings> }, TContext> => {
  return useMutation(getUpdateSettingsMutationOptions(options));
};

export const getRequestUploadUrlUrl = () => `/api/storage/uploads/request-url`;

export const requestUploadUrl = async (uploadUrlRequest: UploadUrlRequest, options?: RequestInit): Promise<UploadUrlResponse> => {
  return customFetch<UploadUrlResponse>(getRequestUploadUrlUrl(), { ...options, method: 'POST', headers: { 'Content-Type': 'application/json', ...options?.headers }, body: JSON.stringify(uploadUrlRequest) });
};

export const getRequestUploadUrlMutationOptions = <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, { data: BodyType<UploadUrlRequest> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, { data: BodyType<UploadUrlRequest> }, TContext> => {
  const mutationKey = ['requestUploadUrl'];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof requestUploadUrl>>, { data: BodyType<UploadUrlRequest> }> = (props) => { const { data } = props ?? {}; return requestUploadUrl(data, requestOptions); };
  return { mutationFn, ...mutationOptions };
};

export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<UploadUrlRequest>;
export type RequestUploadUrlMutationError = ErrorType<ErrorEnvelope>;

export const useRequestUploadUrl = <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: { mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, { data: BodyType<UploadUrlRequest> }, TContext>, request?: SecondParameter<typeof customFetch> }): UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, { data: BodyType<UploadUrlRequest> }, TContext> => {
  return useMutation(getRequestUploadUrlMutationOptions(options));
};

export const getGetStorageObjectUrl = (objectPath: string) => `/api/storage/objects/${objectPath}`;

export const getStorageObject = async (objectPath: string, options?: RequestInit): Promise<Blob> => {
  return customFetch<Blob>(getGetStorageObjectUrl(objectPath), { ...options, method: 'GET' });
};

export const getGetStorageObjectQueryKey = (objectPath: string) => [`/api/storage/objects/${objectPath}`] as const;

export const getGetStorageObjectQueryOptions = <TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>, request?: SecondParameter<typeof customFetch> }) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetStorageObjectQueryKey(objectPath);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getStorageObject>>> = ({ signal }) => getStorageObject(objectPath, { signal, ...requestOptions });
  return { queryKey, queryFn, enabled: !!(objectPath), ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData> & { queryKey: QueryKey };
};

export type GetStorageObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getStorageObject>>>;
export type GetStorageObjectQueryError = ErrorType<ErrorEnvelope>;

export function useGetStorageObject<TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>, request?: SecondParameter<typeof customFetch> }): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetStorageObjectQueryOptions(objectPath, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}
