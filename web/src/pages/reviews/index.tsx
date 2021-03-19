import React, { Suspense } from "react";
import Axios from "axios";

import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/SEO";
import Box from "../../components/Box";
import Link from "../../components/Link";
import ScaleLoader from "../../components/loaders/Scale";

const Review = React.lazy(() => import("../../components/reviews/Review"));

import { ApiResponse, UserReview } from "../../../types";

interface State {
  reviews: UserReview[];
  error?: string;
  loading: boolean;
}
interface Props {}

export default class Reviews extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      reviews: [],
      error: undefined,
      loading: false,
    };
  }

  public componentDidMount() {
    this.setState({ loading: true });
    Axios.get<ApiResponse>(`${process.env.API}/reviews`)
      .then((res) => this.setState({ reviews: res.data.data, error: undefined }))
      .catch((err) => this.setState({ error: err.response.data.error || "Failed to fetch reviews" }))
      .finally(() => this.setState({ loading: false }));
  }

  public render() {
    const average = this.state.reviews.map((r) => r.stars).reduce((prev, curr) => (prev += curr), 0) / this.state.reviews.length;
    const rounded = Math.round(average * 10) / 10;

    return (
      <Layout>
        <SEO title="Reviews" description={`${rounded} out of 5 stars`} />
        <Box>
          <h1 className="font-nunito font-bold">Reviews</h1>
          <span className={`text-${rounded >= 4 ? "green" : rounded >= 2 ? "yellow" : "red"}-500`}>{rounded}/5</span>
          <br />
          <Link to="/reviews/create" className="text-blue-400 hover:underline hover:text-blue-500">
            Create a review
          </Link>
          <br />
          {this.state.error && <span className="text-red-500">{this.state.error}</span>}
        </Box>
        <div className="mb-8" />
        {this.state.loading ? (
          <span className="mx-auto">
            <ScaleLoader />
          </span>
        ) : (
          this.state.reviews.map((review, i) => (
            <Suspense fallback={false} key={i}>
              <Review {...review} />
            </Suspense>
          ))
        )}
      </Layout>
    );
  }
}
