import { users, type User, type InsertUser, svgs, type Svg, type InsertSvg } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // SVG methods
  getCurrentSvg(): Promise<Svg | undefined>;
  getAllSvgs(): Promise<Svg[]>;
  createSvg(svg: InsertSvg): Promise<Svg>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private svgs: Map<number, Svg>;
  private userCurrentId: number;
  private svgCurrentId: number;

  constructor() {
    this.users = new Map();
    this.svgs = new Map();
    this.userCurrentId = 1;
    this.svgCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // SVG methods
  async getCurrentSvg(): Promise<Svg | undefined> {
    // Get the most recently created SVG
    const svgs = Array.from(this.svgs.values());
    if (svgs.length === 0) return undefined;
    
    // Sort by id descending (newest first) and return the first one
    return svgs.sort((a, b) => b.id - a.id)[0];
  }

  async getAllSvgs(): Promise<Svg[]> {
    return Array.from(this.svgs.values()).sort((a, b) => b.id - a.id);
  }

  async createSvg(insertSvg: InsertSvg): Promise<Svg> {
    const id = this.svgCurrentId++;
    const now = new Date();
    const svg: Svg = { 
      ...insertSvg, 
      id, 
      createdAt: now
    };
    this.svgs.set(id, svg);
    return svg;
  }
}

export const storage = new MemStorage();
