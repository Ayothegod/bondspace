import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username is too short" })
    .max(60, { message: "Username is too long" }),
  fullname: z
    .string({ message: "Fullname is required" })
    .min(3, { message: "Fullname is too short" })
    .max(60, { message: "Fullname is too long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Name is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be up to 6 characters" }),
});

export const loginUserSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username is too short" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be up to 6 characters" }),
});

// module.exports = {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "var(--border)",
//         input: "var(--input)",
//         ring: "var(--ring)",
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//         "background-top": "var(--background-top)",
//         "foreground-top": "var(--foreground-top)",
//         primary: {
//           DEFAULT: "var(--primary)",
//           foreground: "var(--primary-foreground)",
//         },
//         secondary: {
//           DEFAULT: "var(--secondary)",
//           foreground: "var(--secondary-foreground)",
//         },
//         destructive: {
//           DEFAULT: "var(--destructive)",
//           foreground: "var(--destructive-foreground)",
//         },
//         muted: {
//           DEFAULT: "var(--muted)",
//           foreground: "var(--muted-foreground)",
//         },
//         accent: {
//           DEFAULT: "var(--accent)",
//           foreground: "var(--accent-foreground)",
//         },
//         popover: {
//           DEFAULT: "var(--popover)",
//           foreground: "var(--popover-foreground)",
//         },
//         card: {
//           DEFAULT: "var(--card)",
//           foreground: "var(--card-foreground)",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//       fontFamily: {
//         inter: ["Inter", "sans-serif"],
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
// };
