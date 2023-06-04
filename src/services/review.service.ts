import { Service } from 'typedi';
import { DB } from '@database';
import { CreateReviewDto } from '@/dtos/review.dto';
import { HttpException } from '@/exceptions/httpException';
import { Reviews } from '@interfaces/reviews.interface';

@Service()
export class ReviewService {
  public async findAllReviews(): Promise<Reviews[]> {
    const allReviews: Reviews[] = await DB.Reviews.findAll();
    return allReviews;
  }

  public async findallReviewsById(reviewId: number): Promise<Reviews> {
    const findReview: Reviews = await DB.Reviews.findByPk(reviewId);
    if (!findReview) throw new HttpException(409, "Product doesn't exist");

    return findReview;
  }

  public async createReview(reviewData: CreateReviewDto): Promise<Reviews> {
    const findReview = await DB.Reviews.findOne({ where: { id: reviewData.id } });
    if (findReview) throw new HttpException(409, `This review ${reviewData.id} already exists`);

    const createReviewData: Reviews = await DB.Reviews.create(reviewData);
    return createReviewData;
  }

  public async updateReview(reviewId: number, reviewData: CreateReviewDto): Promise<Reviews> {
    const findReview: Reviews = await DB.Reviews.findByPk(reviewId);
    if (!findReview) throw new HttpException(409, "Review doesn't exist");

    await DB.Reviews.update(reviewData, { where: { id: reviewId } });

    const updatedReview: Reviews = await DB.Reviews.findByPk(reviewId);
    return updatedReview;
  }

  public async deleteReview(reviewId: number): Promise<Reviews> {
    const findReview: Reviews = await DB.Reviews.findByPk(reviewId);
    if (!findReview) throw new HttpException(409, "Review doesn't exist");

    await DB.Reviews.destroy({ where: { id: reviewId } });

    return findReview;
  }
}