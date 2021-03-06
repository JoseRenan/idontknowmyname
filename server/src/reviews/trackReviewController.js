/* @flow */

import express from 'express';
import checkAuth from '../firebase/firebaseAuthHandler';
import {
    createReview,
    getUserReview,
    getReviews,
    updateUserReview,
} from './reviewCollections';

const router = express.Router();
export const TRACK = 'track';

router.get('/tracks/:trackId/reviews', (req, res) => {
    const trackId = req.params.trackId;
    getReviews(TRACK, trackId)
        .then(reviews => res.status(200).send(reviews))
        .catch(error => {
            if (!error.status) error.status = 500;
            res.status(error.status).send(error);
            console.error(error);
        });
});

router.get('/tracks/:trackId/reviews/me', checkAuth, (req, res) => {
    const trackId = req.params.trackId;
    const authorUid = req.user.uid;
    getUserReview(trackId, authorUid, TRACK)
        .then(reviews => {
            reviews.size === 0
                ? res.status(204).send()
                : res.status(200).send(reviews.docs[0].data());
        })
        .catch(error => {
            if (!error.status) error.status = 500;
            res.status(error.status).send(error);
            console.error(error);
        });
});

router.post('/tracks/:trackId/reviews', checkAuth, (req, res) => {
    const review = req.body;
    review.contentId = req.params.trackId;
    review.authorUid = req.user.uid;
    review.contentType = TRACK;
    if (!review.review || !review.review.createdAt) {
        review.review = review.review || {};
        review.review.createdAt = new Date();
        review.review.updatedAt = review.review.createdAt;
    }
    createReview(review)
        .then(review => res.status(201).send(review))
        .catch(error => {
            if (!error.status) error.status = 500;
            res.status(error.status).send(error);
            console.error(error);
        });
});

router.put('/tracks/:trackId/reviews/:reviewId', checkAuth, (req, res) => {
    const review = req.body;
    review.contentId = req.params.trackId;
    review.authorUid = req.user.uid;
    review.contentType = TRACK;
    updateUserReview(req.params.reviewId, review)
        .then(review => res.status(200).send(review))
        .catch(error => {
            if (!error.status) error.status = 500;
            res.status(error.status).send(error);
            console.error(error);
        });
});

export default router;
