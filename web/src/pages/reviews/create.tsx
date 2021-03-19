import React, { Suspense } from "react";
import Axios from "axios";

import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/SEO";
import Box from "../../components/Box";
import ScaleLoader from "../../components/loaders/Scale";
import Link from "../../components/Link";

const ReviewForm = React.lazy(() => import("../../components/reviews/ReviewForm"));

import { UserReview } from "../../../types";
import { getCurrentJwt, getCurrentUser } from "../../../util";

interface State {
  loading: boolean;
  error?: string;
  alreadyCreated?: boolean;
  meReview?: UserReview;
}
interface Props {}

export default class Reviews extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      loading: false,
      alreadyCreated: undefined,
      error: undefined,
    };
  }

  public componentDidMount() {
    if (!getCurrentUser(true)) return;

    this.setState({ loading: true });
    Axios.get(`${process.env.API}/reviews/me`, {
      headers: {
        Authorization: `Bearer ${getCurrentJwt()}`,
      },
    })
      .then(({ data }) => this.setState({ meReview: data.data, alreadyCreated: true }))
      .catch((err) => this.setState({ error: err.response.data.error || err, alreadyCreated: err.response.status !== 404 }))
      .finally(() => this.setState({ loading: false }));
  }

  public render() {
    return (
      <Layout>
        <SEO title="Create a review" description="Leave a review for matievisthekat.dev" />
        <Box>
          {this.state.loading || this.state.alreadyCreated === undefined ? (
            <ScaleLoader />
          ) : !this.state.alreadyCreated ? (
            <Suspense fallback={true}>
              <ReviewForm />
            </Suspense>
          ) : (
            <span>
              You have already created a review. You can view it <Link className="link" to={`/reviews/view/?id=${this.state.meReview?.id}`}>here</Link>
            </span>
          )}
        </Box>
      </Layout>
    );
  }
}
