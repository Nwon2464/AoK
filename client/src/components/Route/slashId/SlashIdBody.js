import React from "react";
import { Link } from "react-router-dom";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import SaveAltOutlinedIcon from "@material-ui/icons/SaveAltOutlined";

import CheckoutIcon from "../../error/checkoutIcon";
import { useLanguage } from "../../../i18n/LanguageProvider";

const SlashIdBody = ({ channel }) => {
  const { t } = useLanguage();
  const { user, liveStream } = channel;
  const channelInfo = channel.channel;
  const game = liveStream?.game || channelInfo?.game;
  const title = liveStream?.title || channelInfo?.title;

  return (
    <div className="app-body-right-background">
      <div className="app-flex app-justify-content-between app-relative">
        <div className="app-mg-1 app-full-width app-flex">
          <div className="app-mg-t-03 app-pd-l-1">
            <Link to={`/${user.login}/videos/all`}>
              <div className="app-relative">
                <figure className="tw-avatar--size-50">
                  <img
                    className="channel-page-profile"
                    src={user.profileImageUrl}
                    alt={`${user.displayName} profile`}
                  />
                </figure>
                {liveStream && (
                  <div className="channel-page-live-badge app-absolute app-flex app-full-width app-align-items-center app-justify-content-center">
                    <p className="app-uppercase app-live-indicator app-font-weight app-border-radius">live</p>
                  </div>
                )}
              </div>
            </Link>
          </div>

          <div className="app-flex app-flex-column app-full-width app-pd-x-1">
            <div className="channel-page-title-row app-flex app-justify-content-between app-align-items-end">
              <div className="app-flex app-align-items-baseline">
                <h2>{user.displayName}</h2>
                <CheckoutIcon />
              </div>
              <div className="app-flex app-justify-content-end app-align-items-center">
                <button className="channel-page-action app-core-primary">
                  <FavoriteBorderOutlinedIcon />
                  <span>{t("channel.follow")}</span>
                </button>
                <button className="channel-page-action app-core-secondary app-mg-l-05">
                  <StarBorderOutlinedIcon />
                  <span>{t("channel.subscribe")}</span>
                  <ExpandMoreOutlinedIcon />
                </button>
              </div>
            </div>

            <div className="app-flex">
              <div className="app-flex app-flex-grow-1 app-flex-shrink-1">
                <div className="app-flex app-full-width app-flex-column app-mg-b-03">
                  {title && <h5>{title}</h5>}
                  {game?.id && (
                    <Link
                      to={`/category/games/${game.id}`}
                      className="app-color-main app-font-size-5"
                    >
                      {game.name}
                    </Link>
                  )}
                </div>
              </div>
              <div className="channel-page-secondary-actions app-flex app-align-items-start">
                <button><SaveAltOutlinedIcon /></button>
                <button><MoreVertOutlinedIcon /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlashIdBody;
