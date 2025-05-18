import localFont from "next/font/local";

// Regular Söhne
export const sohne = localFont({
  src: [
    {
      path: "../../public/font/TestSohne-Buch-BF663d89cd32e6a.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/TestSohne-BuchKursiv-BF663d89cd3e887.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/font/TestSohne-Leicht-BF663d89cd4952e.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/font/TestSohne-LeichtKursiv-BF663d89cd9a361.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/font/TestSohne-Halbfett-BF663d89cd2d67b.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/TestSohne-HalbfettKursiv-BF663d89cd41624.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/font/TestSohne-Fett-BF663d89cca89ff.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/TestSohne-FettKursiv-BF663d89cc64878.otf",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-sohne",
});
