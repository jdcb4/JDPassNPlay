import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/app/RootLayout";
import { HatGameApp } from "@/features/hat-game/HatGameApp";
import { HomePage } from "@/features/home/HomePage";
import { ImposterPlaceholder } from "@/features/imposter/ImposterPlaceholder";
import { WhoWhatWhereApp } from "@/features/whowhatwhere/WhoWhatWhereApp";

const baseUrl = import.meta.env.BASE_URL;

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "games/whowhatwhere", element: <WhoWhatWhereApp /> },
        { path: "games/hat", element: <HatGameApp /> },
        { path: "games/imposter", element: <ImposterPlaceholder /> },
      ],
    },
  ],
  { basename: baseUrl.replace(/\/$/, "") || "/" },
);
