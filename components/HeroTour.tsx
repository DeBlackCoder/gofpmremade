"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function HeroTour() {
  useEffect(() => {
    if (sessionStorage.getItem("hero-tour-done")) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0,0,0,0.6)",
      stagePadding: 8,
      stageRadius: 6,
      steps: [
        {
          element: "[data-tour='brand']",
          popover: {
            title: "Home",
            description:
              "You're at Assemblies Of God Church — a Spirit-filled community in Port Harcourt.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='watch-live']",
          popover: {
            title: "Watch Live",
            description:
              "Join our Sunday services and Bible studies live from anywhere in the world.",
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "[data-tour='heading']",
          popover: {
            title: "Our Heart",
            description:
              "Everything we do flows from this — loving God and serving people.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='latest-sermons']",
          popover: {
            title: "Latest Sermons",
            description:
              "Read our most recent messages. Each one is written to be read slowly and taken to heart.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "[data-tour='nav']",
          popover: {
            title: "Explore",
            description:
              "Navigate to any part of the site — Community, Events, Give, Sermons, and more.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "[data-tour='daily-quote']",
          popover: {
            title: "Word for Today",
            description:
              "A fresh pastoral quote every day to encourage and ground you in the Word.",
            side: "top",
            align: "end",
          },
        },
      ],
      onDestroyStarted: () => {
        sessionStorage.setItem("hero-tour-done", "1");
        driverObj.destroy();
      },
    });

    const t = setTimeout(() => driverObj.drive(), 1800);
    return () => clearTimeout(t);
  }, []);

  return null;
}
