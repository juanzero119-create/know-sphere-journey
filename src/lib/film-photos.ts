type PhotoAsset = { url: string };
export type FilmPhoto = { url: string; label: string };

const assets = import.meta.glob<PhotoAsset>('../assets/trailer-photos/*.asset.json', {
  eager: true,
  import: 'default',
});

export function trailerPhotosForFilm(id: string): FilmPhoto[] {
  return [1, 2, 3].flatMap(frame => {
    const asset = assets[`../assets/trailer-photos/${id}-${frame}.jpg.asset.json`];
    return asset ? [{ url: asset.url, label: `Trailer frame ${frame}` }] : [];
  });
}