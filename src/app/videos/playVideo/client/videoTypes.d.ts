// videoTypes.d.ts

export interface User {
    id: string;
    username: string;
    avatar: string;
  }

export interface Comment {
    id: string;
    user: User;
    content: string;
    createdAt: string; // ISO date string
  }

export interface Channel {
    id: string;
    channelName: string;
    avatar: string;
  }

export interface Video {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    description?: string;
  }

// For an array of videos
export type VideoList = Video[];
