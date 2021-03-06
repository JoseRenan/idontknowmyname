import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Album, AlbumSimplified } from 'spotify-web-sdk';

import { getSeveralAlbums } from '../../api/AlbumAPI';
import objectToJson from '../../utils/objectToJson';
import Rating from '../common/rating/Rating';

import './ArtistPageContent.css';

type AlbumWithRating = Album & { average: number };

type Props = {
    albums: AlbumSimplified[],
    albumsAverages: number[],
    bestRatedAlbums: AlbumWithRating[],
};

const ArtistPageContent = ({
    albums,
    albumsAverages,
    bestRatedAlbums,
}: Props) => {
    const [completeAlbums, setCompleteAlbums] = useState([]);
    const [completeRatedAlbums, setCompleteRatedAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCompleteAlbums() {
            const albumIds = albums.map(album => album.id);
            const albumsPromises = [];
            for (let i = 0; i < Math.ceil(albums.length / 20); i += 1) {
                const aux = getSeveralAlbums(
                    albumIds.slice(i * 20 + 1, i * 20 + 20)
                );
                albumsPromises.push(aux);
            }
            const albumsResponse = (await Promise.all(albumsPromises)).flat();
            const albumsWithAverages = albumsResponse.map((a, index) => ({
                ...objectToJson(a),
                average: albumsAverages[index],
            }));

            setCompleteAlbums(albumsWithAverages);
            setLoading(false);
        }

        fetchCompleteAlbums();
    }, [albums]);

    useEffect(() => {
        async function fetchCompleteRatedAlbums() {
            const albumIds = bestRatedAlbums.map(album => album.id);
            const averages = bestRatedAlbums.map(album => album.average);
            const albumsResponse = await getSeveralAlbums(albumIds);
            const albumsWithAverages = albumsResponse.map((a, index) => ({
                ...objectToJson(a),
                average: averages[index],
            }));

            setCompleteRatedAlbums(albumsWithAverages);
            setLoading(false);
        }

        fetchCompleteRatedAlbums();
    }, [bestRatedAlbums]);

    return loading ? (
        <Loading />
    ) : (
        <div className="artist-page-content col-lg-8">
            <h1 className="discography-title">
                <FormattedMessage id="discography" />
            </h1>
            <h2 className="discography-section-title">
                <FormattedMessage id="best-rated-albums" />
            </h2>
            <DiscographySection bestRated albums={completeRatedAlbums} />
            <h2 className="discography-section-title">
                <FormattedMessage id="all-albums" />
            </h2>
            <DiscographySection bestRated={false} albums={completeAlbums} />
        </div>
    );
};

const Loading = () => (
    <div className="bg-white col-lg-8 w-100 pt-4 d-flex justify-content-center">
        <div className="spinner spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
);

const filterMaxPopularity = (albums: AlbumWithRating[]): AlbumWithRating[] =>
    Object.values(
        albums.reduce((prev, curr) => {
            const accum = prev;
            accum[curr.name] =
                accum[curr.name] &&
                accum[curr.name].popularity > curr.popularity
                    ? accum[curr.name]
                    : curr;
            return accum;
        }, {})
    );

const DiscographySection = ({
    albums,
    bestRated,
}: {
    albums: AlbumWithRating[],
    bestRated: boolean,
}) => {
    const [page, setPage] = useState(0);
    const { push } = useHistory();
    const maxPopularityAlbums = filterMaxPopularity(albums);
    const filteredAlbums = bestRated
        ? maxPopularityAlbums
        : maxPopularityAlbums
              .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
              .slice(10 * page, (page + 1) * 10 - 1);

    return (
        <>
            <table className="table discography-section-table">
                <tbody>
                    {filteredAlbums.map(album => (
                        <tr
                            key={album.id}
                            className="clickable p-2"
                            onClick={() => push(`/album/${album.id}/`)}>
                            <td className="discography-section-table-data">
                                <img
                                    className="artist-discography-album-cover"
                                    src={
                                        album.imageUrl ??
                                        album?.images?.[0]?.url
                                    }
                                    alt={album.name}
                                />
                            </td>
                            <td className="p-2">
                                <span className="discography-section-album-name">
                                    {album.name}
                                </span>
                                <br />
                                <span className="discography-section-album-details">
                                    <FormattedMessage
                                        id="tracks-in-album"
                                        values={{
                                            trackCount: album.totalTracks,
                                        }}
                                    />
                                    {' • '}
                                    {album.releaseYear}
                                </span>
                            </td>
                            <td className="discography-section-table-data text-center d-none d-table-cell-sm">
                                <FormattedMessage id="average-rating" />
                                <br />
                                {album.average > 0 ? (
                                    <Rating
                                        initialValue={album.average}
                                        displayOnly
                                    />
                                ) : (
                                    <i>
                                        <FormattedMessage id="not-rated-yet" />
                                    </i>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginBottom: '2rem',
                }}>
                {page > 0 && (
                    <button
                        onClick={() => setPage(page - 1)} // TODO go up to the first album
                        className="btn btn-secondary">
                        <FormattedMessage id="previous-page" />
                    </button>
                )}
                {maxPopularityAlbums.length / 10 - 1 > page && (
                    <button
                        onClick={() => setPage(page + 1)} // TODO go up to the first album
                        className="btn btn-secondary">
                        <FormattedMessage id="next-page" />
                    </button>
                )}
            </div>
        </>
    );
};

export default ArtistPageContent;
