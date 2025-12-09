"use client";
import React from "react";
import { ThemeProvider } from "@/context/ThemeContext"; // Импортируем ThemeProvider
import "./globals.css";
import { MainComponent } from "./Components/MainComponent/MainComponent";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
        <MainComponent>{children}</MainComponent>
    </ThemeProvider>
  );
}
