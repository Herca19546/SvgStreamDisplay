import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { svgContentSchema, insertSvgSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to receive SVG content
  app.post("/api/svg", async (req: Request, res: Response) => {
    try {
      // Validate that request contains valid SVG content
      const { content } = svgContentSchema.parse(req.body);
      
      // Parse SVG to get metadata
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(content, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      
      // Extract metadata
      const width = svgElement.getAttribute("width") 
        ? parseInt(svgElement.getAttribute("width") || "0", 10) 
        : undefined;
      
      const height = svgElement.getAttribute("height") 
        ? parseInt(svgElement.getAttribute("height") || "0", 10) 
        : undefined;
      
      // Count elements in the SVG
      const elementCount = svgDoc.querySelectorAll("*").length;
      
      // Calculate size in bytes
      const size = content.length;
      
      // Create the SVG record
      const svgData = {
        content,
        width,
        height,
        elementCount,
        size
      };
      
      const validatedData = insertSvgSchema.parse(svgData);
      const savedSvg = await storage.createSvg(validatedData);
      
      return res.status(201).json({
        success: true,
        data: savedSvg
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message
        });
      }
      
      console.error("Error saving SVG:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error occurred while processing the SVG"
      });
    }
  });

  // API endpoint to get the current SVG
  app.get("/api/svg/current", async (_req: Request, res: Response) => {
    try {
      const currentSvg = await storage.getCurrentSvg();
      
      if (!currentSvg) {
        return res.status(404).json({
          success: false,
          message: "No SVG found"
        });
      }
      
      return res.status(200).json({
        success: true,
        data: currentSvg
      });
    } catch (error) {
      console.error("Error fetching current SVG:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error occurred while fetching the SVG"
      });
    }
  });

  // API endpoint to get all SVGs
  app.get("/api/svg/all", async (_req: Request, res: Response) => {
    try {
      const allSvgs = await storage.getAllSvgs();
      
      return res.status(200).json({
        success: true,
        data: allSvgs
      });
    } catch (error) {
      console.error("Error fetching all SVGs:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error occurred while fetching SVGs"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
