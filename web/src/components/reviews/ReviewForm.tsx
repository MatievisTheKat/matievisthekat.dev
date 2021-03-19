import React from "react";
import Axios from "axios";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { navigate } from "gatsby";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button";

import { getCurrentJwt, getCurrentUser, onInputChange } from "../../../util";

interface State {
  text?: string;
  stars?: number;
  error?: string;
  hoveredStar?: number;
  loading: boolean;
}
interface Props {}

export default class ReviewForm extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      text: undefined,
      stars: undefined,
      error: undefined,
      hoveredStar: undefined,
      loading: false,
    };
  }

  private submit() {
    const body = this.state.text;
    const stars = this.state.stars;

    this.setState({ loading: true });

    Axios.post(
      `${process.env.API}/reviews/create`,
      { stars, body },
      {
        headers: {
          Authorization: `Bearer ${getCurrentJwt()}`,
        },
      }
    )
      .then((res) => navigate(`/reviews/view/?id=${res.data.id}`))
      .catch((err) => this.setState({ error: err.response.data.error || err }));
  }

  public render() {
    if (typeof window === "undefined") return null;
    const user = getCurrentUser(true);
    if (!user) return null;

    const arr = new Array(5).fill(null);
    arr.forEach((e, i) => {
      i = i + 1;
      arr[i] = (
        <FontAwesomeIcon
          icon={faStar}
          size="2x"
          className={`${
            (this.state.hoveredStar && this.state.hoveredStar >= i) || (this.state.stars && this.state.stars >= i) ? "text-yellow-400" : null
          } mx-0.5 hover:pointer hover:text-yellow-400`}
          key={i}
          onMouseEnter={() => this.setState({ hoveredStar: i })}
          onMouseLeave={() => this.setState({ hoveredStar: undefined })}
          onClick={() => this.setState({ stars: i })}
        />
      );
    });

    return (
      <>
        <h1 className="font-bold mb-3">Create a review</h1>
        <form className="text-center" onSubmit={(e) => e.preventDefault()}>
          <textarea
            rows={7}
            className="mb-5 resize-y py-2 px-3 w-full shadow appearance-none border rounded leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Review"
            value={this.state.text || ""}
            onChange={onInputChange("text", "error", (val) => {
              return val.length > 255 ? "Your review must be less tha 255 characters" : undefined;
            }).bind(this)}
          />
          <label htmlFor="stars" className="font-bold block mb-3">
            Stars
          </label>
          <div className="block mb-5">{arr}</div>
          {this.state.error && <p className="text-red-500 text-xs italic mb-4">{this.state.error}</p>}
          <Button
            loading={this.state.loading}
            disabled={this.state.loading}
            onClick={() => {
              if (!this.state.stars || this.state.stars > 5 || this.state.stars < 1) this.setState({ error: "Please enter a valid amount of stars" });
              if (!this.state.text || this.state.text.length > 255) this.setState({ error: "Please provide a review of less than 255 characters" });

              if (this.state.error) return;

              this.submit();
            }}
          >
            Submit
          </Button>
        </form>
      </>
    );
  }
}
