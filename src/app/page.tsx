"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SudokuApp from "./sudoku";
import MemoriesCarousel from "./memories";

export default function Home() {
  // return (
  //   <div className="flex justify-center items-center bg-contain flex-col h-screen">
  //     <Tabs defaultValue="carousel">
  //       <TabsList className="grid w-full grid-cols-2">
  //         <TabsTrigger value="carousel">Carousel</TabsTrigger>
  //         <TabsTrigger value="sudoku">Sudoku</TabsTrigger>
  //       </TabsList>
  //       <TabsContent value="carousel">
  //         <MemoriesCarousel />
  //       </TabsContent>
  //       <TabsContent value="sudoku">
  //         <SudokuApp />
  //       </TabsContent>
  //     </Tabs>
  //   </div>
  // );
  return <SudokuApp />;
}
