import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { Appointment, CreateAppointmentBody, CreateFormBody, CreatePatientBody, DashboardSummary, ErrorResponse, GenerateScheduleBody, HealthStatus, ListAppointmentsParams, ListPatientsParams, MedicalForm, Patient, UpdateAppointmentBody, UpdateFormBody, UpdatePatientBody } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all patients
 */
export declare const getListPatientsUrl: (params?: ListPatientsParams) => string;
export declare const listPatients: (params?: ListPatientsParams, options?: RequestInit) => Promise<Patient[]>;
export declare const getListPatientsQueryKey: (params?: ListPatientsParams) => readonly ["/api/patients", ...ListPatientsParams[]];
export declare const getListPatientsQueryOptions: <TData = Awaited<ReturnType<typeof listPatients>>, TError = ErrorType<unknown>>(params?: ListPatientsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPatients>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPatients>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPatientsQueryResult = NonNullable<Awaited<ReturnType<typeof listPatients>>>;
export type ListPatientsQueryError = ErrorType<unknown>;
/**
 * @summary List all patients
 */
export declare function useListPatients<TData = Awaited<ReturnType<typeof listPatients>>, TError = ErrorType<unknown>>(params?: ListPatientsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPatients>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a patient
 */
export declare const getCreatePatientUrl: () => string;
export declare const createPatient: (createPatientBody: CreatePatientBody, options?: RequestInit) => Promise<Patient>;
export declare const getCreatePatientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPatient>>, TError, {
        data: BodyType<CreatePatientBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPatient>>, TError, {
    data: BodyType<CreatePatientBody>;
}, TContext>;
export type CreatePatientMutationResult = NonNullable<Awaited<ReturnType<typeof createPatient>>>;
export type CreatePatientMutationBody = BodyType<CreatePatientBody>;
export type CreatePatientMutationError = ErrorType<unknown>;
/**
 * @summary Create a patient
 */
export declare const useCreatePatient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPatient>>, TError, {
        data: BodyType<CreatePatientBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPatient>>, TError, {
    data: BodyType<CreatePatientBody>;
}, TContext>;
/**
 * @summary Get patient by ID
 */
export declare const getGetPatientUrl: (id: number) => string;
export declare const getPatient: (id: number, options?: RequestInit) => Promise<Patient>;
export declare const getGetPatientQueryKey: (id: number) => readonly [`/api/patients/${number}`];
export declare const getGetPatientQueryOptions: <TData = Awaited<ReturnType<typeof getPatient>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPatient>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPatient>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPatientQueryResult = NonNullable<Awaited<ReturnType<typeof getPatient>>>;
export type GetPatientQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get patient by ID
 */
export declare function useGetPatient<TData = Awaited<ReturnType<typeof getPatient>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPatient>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a patient
 */
export declare const getUpdatePatientUrl: (id: number) => string;
export declare const updatePatient: (id: number, updatePatientBody: UpdatePatientBody, options?: RequestInit) => Promise<Patient>;
export declare const getUpdatePatientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePatient>>, TError, {
        id: number;
        data: BodyType<UpdatePatientBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePatient>>, TError, {
    id: number;
    data: BodyType<UpdatePatientBody>;
}, TContext>;
export type UpdatePatientMutationResult = NonNullable<Awaited<ReturnType<typeof updatePatient>>>;
export type UpdatePatientMutationBody = BodyType<UpdatePatientBody>;
export type UpdatePatientMutationError = ErrorType<unknown>;
/**
 * @summary Update a patient
 */
export declare const useUpdatePatient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePatient>>, TError, {
        id: number;
        data: BodyType<UpdatePatientBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePatient>>, TError, {
    id: number;
    data: BodyType<UpdatePatientBody>;
}, TContext>;
/**
 * @summary Get all forms for a patient
 */
export declare const getGetPatientFormsUrl: (id: number) => string;
export declare const getPatientForms: (id: number, options?: RequestInit) => Promise<MedicalForm[]>;
export declare const getGetPatientFormsQueryKey: (id: number) => readonly [`/api/patients/${number}/forms`];
export declare const getGetPatientFormsQueryOptions: <TData = Awaited<ReturnType<typeof getPatientForms>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPatientForms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPatientForms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPatientFormsQueryResult = NonNullable<Awaited<ReturnType<typeof getPatientForms>>>;
export type GetPatientFormsQueryError = ErrorType<unknown>;
/**
 * @summary Get all forms for a patient
 */
export declare function useGetPatientForms<TData = Awaited<ReturnType<typeof getPatientForms>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPatientForms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a medical form
 */
export declare const getCreateFormUrl: () => string;
export declare const createForm: (createFormBody: CreateFormBody, options?: RequestInit) => Promise<MedicalForm>;
export declare const getCreateFormMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createForm>>, TError, {
        data: BodyType<CreateFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createForm>>, TError, {
    data: BodyType<CreateFormBody>;
}, TContext>;
export type CreateFormMutationResult = NonNullable<Awaited<ReturnType<typeof createForm>>>;
export type CreateFormMutationBody = BodyType<CreateFormBody>;
export type CreateFormMutationError = ErrorType<unknown>;
/**
 * @summary Create a medical form
 */
export declare const useCreateForm: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createForm>>, TError, {
        data: BodyType<CreateFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createForm>>, TError, {
    data: BodyType<CreateFormBody>;
}, TContext>;
/**
 * @summary Get form by ID
 */
export declare const getGetFormUrl: (id: number) => string;
export declare const getForm: (id: number, options?: RequestInit) => Promise<MedicalForm>;
export declare const getGetFormQueryKey: (id: number) => readonly [`/api/forms/${number}`];
export declare const getGetFormQueryOptions: <TData = Awaited<ReturnType<typeof getForm>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getForm>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getForm>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFormQueryResult = NonNullable<Awaited<ReturnType<typeof getForm>>>;
export type GetFormQueryError = ErrorType<unknown>;
/**
 * @summary Get form by ID
 */
export declare function useGetForm<TData = Awaited<ReturnType<typeof getForm>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getForm>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a medical form
 */
export declare const getUpdateFormUrl: (id: number) => string;
export declare const updateForm: (id: number, updateFormBody: UpdateFormBody, options?: RequestInit) => Promise<MedicalForm>;
export declare const getUpdateFormMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateForm>>, TError, {
        id: number;
        data: BodyType<UpdateFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateForm>>, TError, {
    id: number;
    data: BodyType<UpdateFormBody>;
}, TContext>;
export type UpdateFormMutationResult = NonNullable<Awaited<ReturnType<typeof updateForm>>>;
export type UpdateFormMutationBody = BodyType<UpdateFormBody>;
export type UpdateFormMutationError = ErrorType<unknown>;
/**
 * @summary Update a medical form
 */
export declare const useUpdateForm: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateForm>>, TError, {
        id: number;
        data: BodyType<UpdateFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateForm>>, TError, {
    id: number;
    data: BodyType<UpdateFormBody>;
}, TContext>;
/**
 * @summary Submit (confirm) a form by doctor
 */
export declare const getSubmitFormUrl: (id: number) => string;
export declare const submitForm: (id: number, options?: RequestInit) => Promise<MedicalForm>;
export declare const getSubmitFormMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitForm>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitForm>>, TError, {
    id: number;
}, TContext>;
export type SubmitFormMutationResult = NonNullable<Awaited<ReturnType<typeof submitForm>>>;
export type SubmitFormMutationError = ErrorType<unknown>;
/**
 * @summary Submit (confirm) a form by doctor
 */
export declare const useSubmitForm: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitForm>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitForm>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List appointments
 */
export declare const getListAppointmentsUrl: (params?: ListAppointmentsParams) => string;
export declare const listAppointments: (params?: ListAppointmentsParams, options?: RequestInit) => Promise<Appointment[]>;
export declare const getListAppointmentsQueryKey: (params?: ListAppointmentsParams) => readonly ["/api/appointments", ...ListAppointmentsParams[]];
export declare const getListAppointmentsQueryOptions: <TData = Awaited<ReturnType<typeof listAppointments>>, TError = ErrorType<unknown>>(params?: ListAppointmentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAppointmentsQueryResult = NonNullable<Awaited<ReturnType<typeof listAppointments>>>;
export type ListAppointmentsQueryError = ErrorType<unknown>;
/**
 * @summary List appointments
 */
export declare function useListAppointments<TData = Awaited<ReturnType<typeof listAppointments>>, TError = ErrorType<unknown>>(params?: ListAppointmentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create appointment
 */
export declare const getCreateAppointmentUrl: () => string;
export declare const createAppointment: (createAppointmentBody: CreateAppointmentBody, options?: RequestInit) => Promise<Appointment>;
export declare const getCreateAppointmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
        data: BodyType<CreateAppointmentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
    data: BodyType<CreateAppointmentBody>;
}, TContext>;
export type CreateAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof createAppointment>>>;
export type CreateAppointmentMutationBody = BodyType<CreateAppointmentBody>;
export type CreateAppointmentMutationError = ErrorType<unknown>;
/**
 * @summary Create appointment
 */
export declare const useCreateAppointment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
        data: BodyType<CreateAppointmentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAppointment>>, TError, {
    data: BodyType<CreateAppointmentBody>;
}, TContext>;
/**
 * @summary Update appointment status
 */
export declare const getUpdateAppointmentUrl: (id: number) => string;
export declare const updateAppointment: (id: number, updateAppointmentBody: UpdateAppointmentBody, options?: RequestInit) => Promise<Appointment>;
export declare const getUpdateAppointmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
        id: number;
        data: BodyType<UpdateAppointmentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
    id: number;
    data: BodyType<UpdateAppointmentBody>;
}, TContext>;
export type UpdateAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof updateAppointment>>>;
export type UpdateAppointmentMutationBody = BodyType<UpdateAppointmentBody>;
export type UpdateAppointmentMutationError = ErrorType<unknown>;
/**
 * @summary Update appointment status
 */
export declare const useUpdateAppointment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
        id: number;
        data: BodyType<UpdateAppointmentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAppointment>>, TError, {
    id: number;
    data: BodyType<UpdateAppointmentBody>;
}, TContext>;
/**
 * @summary Auto-generate 9-day rehabilitation schedule for a patient
 */
export declare const getGenerateScheduleUrl: () => string;
export declare const generateSchedule: (generateScheduleBody: GenerateScheduleBody, options?: RequestInit) => Promise<Appointment[]>;
export declare const getGenerateScheduleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateSchedule>>, TError, {
        data: BodyType<GenerateScheduleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof generateSchedule>>, TError, {
    data: BodyType<GenerateScheduleBody>;
}, TContext>;
export type GenerateScheduleMutationResult = NonNullable<Awaited<ReturnType<typeof generateSchedule>>>;
export type GenerateScheduleMutationBody = BodyType<GenerateScheduleBody>;
export type GenerateScheduleMutationError = ErrorType<unknown>;
/**
 * @summary Auto-generate 9-day rehabilitation schedule for a patient
 */
export declare const useGenerateSchedule: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateSchedule>>, TError, {
        data: BodyType<GenerateScheduleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof generateSchedule>>, TError, {
    data: BodyType<GenerateScheduleBody>;
}, TContext>;
/**
 * @summary Get dashboard summary stats
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary stats
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get today's appointments
 */
export declare const getGetTodayAppointmentsUrl: () => string;
export declare const getTodayAppointments: (options?: RequestInit) => Promise<Appointment[]>;
export declare const getGetTodayAppointmentsQueryKey: () => readonly ["/api/dashboard/today"];
export declare const getGetTodayAppointmentsQueryOptions: <TData = Awaited<ReturnType<typeof getTodayAppointments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTodayAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTodayAppointments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTodayAppointmentsQueryResult = NonNullable<Awaited<ReturnType<typeof getTodayAppointments>>>;
export type GetTodayAppointmentsQueryError = ErrorType<unknown>;
/**
 * @summary Get today's appointments
 */
export declare function useGetTodayAppointments<TData = Awaited<ReturnType<typeof getTodayAppointments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTodayAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map