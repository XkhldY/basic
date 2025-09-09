'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Star, Building, UserCircle } from 'lucide-react';

interface Company {
    id: number;
    company_name: string;
    industry: string;
    company_description: string;
    company_website: string;
    company_logo_url: string;
}

interface Review {
    id: number;
    rating: number;
    title: string;
    comment: string;
    is_anonymous: boolean;
    created_at: string;
    candidate: {
        id: number;
        name: string;
    } | null;
}

export default function CompanyProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const companyId = params.id;

    const [company, setCompany] = useState<Company | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Review form state
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(true);

    useEffect(() => {
        if (companyId) {
            fetchCompanyAndReviews();
        }
    }, [companyId]);

    const fetchCompanyAndReviews = async () => {
        setLoading(true);
        try {
            // There is no direct endpoint to get company public profile, so we get it from a job of the company.
            // This is a workaround. A better approach would be a dedicated /api/companies/{id} endpoint.
            // For now, this will do. We assume a company has at least one job.
            // A better approach would be to have an admin endpoint to get user details.
            // For now, I will assume an endpoint `/api/users/{user_id}` exists for fetching public user profiles.
            // I will need to create this endpoint in the backend.

            const companyRes = await apiClient.get(`/api/users/${companyId}`);
            setCompany(companyRes.data);

            const reviewsRes = await apiClient.get(`/api/companies/${companyId}/reviews`);
            setReviews(reviewsRes.data);

        } catch (err) {
            setError('Failed to load company details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !title) {
            alert('Please provide a rating and a title.');
            return;
        }

        try {
            await apiClient.post(`/api/companies/${companyId}/reviews`, {
                rating,
                title,
                comment,
                is_anonymous: isAnonymous,
            });
            // Refresh reviews
            fetchCompanyAndReviews();
            // Reset form
            setRating(0);
            setTitle('');
            setComment('');
        } catch (err) {
            alert('Failed to submit review.');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!company) return <div className="text-center py-10">Company not found.</div>;

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : 'No reviews yet';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Company Header */}
                <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                    <div className="flex items-center">
                        {company.company_logo_url ? (
                            <img src={company.company_logo_url} alt={`${company.company_name} logo`} className="h-24 w-24 rounded-full object-cover mr-8" />
                        ) : (
                            <Building className="h-24 w-24 text-gray-400 mr-8" />
                        )}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">{company.company_name}</h1>
                            <p className="text-lg text-gray-600 mt-1">{company.industry}</p>
                            <div className="flex items-center mt-2">
                                <Star className="h-6 w-6 text-yellow-400 mr-1" />
                                <span className="text-xl font-semibold text-gray-800">{averageRating}</span>
                                <span className="text-gray-500 ml-2">({reviews.length} reviews)</span>
                            </div>
                            {company.company_website && (
                                <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
                                    Visit website
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">About {company.company_name}</h2>
                        <p className="text-gray-600">{company.company_description}</p>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

                    {/* Review Form */}
                    {user?.user_type === 'candidate' && (
                        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                className={`h-8 w-8 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Review Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
                                    <textarea
                                        id="comment"
                                        rows={4}
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={e => setIsAnonymous(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Submit anonymously</span>
                                    </label>
                                </div>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="border-b pb-6">
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800">{review.title}</h4>
                                    <p className="text-gray-600 mt-1">{review.comment}</p>
                                    <div className="flex items-center text-sm text-gray-500 mt-3">
                                        {review.is_anonymous || !review.candidate ? (
                                            <>
                                                <UserCircle className="h-5 w-5 mr-2" />
                                                <span>Anonymous</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserCircle className="h-5 w-5 mr-2" />
                                                <span>{review.candidate.name}</span>
                                            </>
                                        )}
                                        <span className="mx-2">·</span>
                                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet for this company.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
