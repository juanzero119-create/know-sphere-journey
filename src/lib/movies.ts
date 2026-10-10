import { actorFilms } from './actor-films';

export const movies: {id:string;title:string;year:number;runtime:number;certificate:string;genres:string[];director:string;image:string;score:number;synopsis:string;cast:[string,string][];themes:string[];language:string}[] = [];
movies.push(...actorFilms);
export type Movie = (typeof movies)[number];
export function runtimeLabel(minutes:number) { return `${Math.floor(minutes/60)}h ${minutes%60}m`; }
