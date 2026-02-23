import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    tagTypes: [
        "Auth",
        "Profile",
        "Blogs"
    ],

    baseQuery: fetchBaseQuery({
        // baseUrl: "http://localhost:5001/api/",
        baseUrl: "https://api.ssbwithisv.in/api/",
        // baseUrl: "https://learning-admin-panel-backend.onrender.com/api/v1/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("authToken");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({

        // ==================== 🔐 AUTHENTICATION ====================

        /** 📝 Register new user */
        register: builder.mutation({
            query: (userData) => ({
                url: "register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["Auth"],
        }),

        /** 🔑 Login user */
        login: builder.mutation({
            query: (credentials) => ({
                url: "login",
                method: "POST",
                body: credentials,
            }),

            invalidatesTags: ["Auth", "Profile"],
        }),

        verifyOtp: builder.mutation({
            query: (body) => ({
                url: "verify-otp",
                method: "POST",
                body
            }),

            invalidatesTags: ["Auth", "Profile"],
        }),


        addLead: builder.mutation({
            query: (body) => ({
                url: "addLead",
                method: "POST",
                body
            }),

            invalidatesTags: ["Auth", "Profile"],
        }),

        /** 👤 Get current user profile */
        userProfile: builder.query({
            query: () => "user/profile",
            providesTags: ["Profile"],
        }),

        updateUserProfile: builder.mutation({
            query: (body) => ({
                url: "user/profile",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Profile"], // 👈 re-fetch profile after update
        }),


        allBlogs: builder.query({
            query: () => "allBlogs",
            providesTags: ["Blogs"],
        }),

        allBlogsById: builder.query({
            query: (id) => `blogDetail/${id}`,
            providesTags: ["Blogs"],
        }),

        getAllMagazine: builder.query({
            query: () => "allMagazinePdfs",
            providesTags: ["Profile"],
        }),

        // ==================== 🔐 PERMISSIONS ====================

        /** ✨ Create new permission (Superadmin only) */



    }),
});

// ==================== 🎯 EXPORT HOOKS ====================

export const {
    // 🔐 Auth
    useRegisterMutation,
    useLoginMutation,


    useAddLeadMutation,
    useVerifyOtpMutation,
    useUserProfileQuery,

    useGetAllMagazineQuery,
    useUpdateUserProfileMutation,

    useAllBlogsQuery,
    useAllBlogsByIdQuery



} = api;