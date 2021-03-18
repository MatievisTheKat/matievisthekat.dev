import React from "react";
import Axios from "axios";
import moment from "moment";

import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/SEO";
import Box from "../../components/Box";
import UserAvatar from "../../components/UserAvatar";

import { ApiResponse, UserReview } from "../../../types";
import AdminBadge from "../../components/AdminBadge";
import Link from "../../components/Link";

interface State {
  reviews: UserReview[];
  error?: string;
}
interface Props {}

export default class Reviews extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      reviews: [],
      error: undefined,
    };
  }

  public componentDidMount() {
    Axios.get<ApiResponse>(`${process.env.API}/reviews`)
      .then((res) => this.setState({ reviews: res.data.data, error: undefined }))
      .catch((err) => this.setState({ error: err?.response?.data?.error || "Failed to fetch reviews" }));
  }

  public render() {
    const average = this.state.reviews.map((r) => r.stars).reduce((prev, curr) => (prev += curr), 0);
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
        {this.state.reviews.map((r, i) => (
          <Box className="px-16 text-left mb-3" key={i}>
            <UserAvatar src={r.avatar_url} width={7} border={false} className="inline-block mr-2" />
            <h1 className="inline-block mr-3">{r.username}</h1>
            {r.admin && <AdminBadge className="-ml-2.5 mr-3 -mb-1.5" />}
            <span className="text-xs">{moment(new Date(r.created_timestamp)).fromNow()}</span>
            <hr className="mt-1 w-2/4 ml-8 mb-3 border border-gray-400" />
            <span className="ml-5">{r.body}</span>
          </Box>
        ))}
      </Layout>
    );
  }
}
