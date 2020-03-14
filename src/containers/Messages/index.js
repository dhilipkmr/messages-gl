import React, { useState, useEffect, useRef, Fragment } from "react";
import { Swipeable } from "react-swipeable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useDebounce from '../../useHooks/useDebounce';
import { getNextMessagesList } from "../../apis/api";
import Shimmer from '../MessageShimmer';
import { createLoadingObserver, calculateTimeDifference} from "../../utilities/utils";
import { THRESHOLD_LENGTH_FROM_LAST, LOADING_MSG, LOADING_MSG_ERR, IMG_HOST} from "../../constants";
import "./msgStyles.css";

function Messages() {
  const [messageList, setMessageList] = useState([]);
  const [pageToken, setPageToken] = useState("");
  const [elementPosition, setElementPosition] = useState(0);  // on reaching this element's position in viewport we call next api
  const [loaderTxt, setLoaderTxt] = useState(LOADING_MSG);
  const [debouncedElementRemoval] = useDebounce([removeHiddenlements, 800]);
  const $thresholdElement = useRef(null);
  const $calloutWrap = useRef(null);
  const currentMsgList = useRef([]);
  
  let observer = null;
  const config = {
    delta: 30, // min distance(px) before a swipe starts
    preventDefaultTouchmoveEvent: false, // preventDefault on touchmove, *See Details*
    trackTouch: true, // track touch input
    trackMouse: true, // track mouse input
    rotationAngle: 0 // set a rotation angle
  };

  function removeHiddenlements() {
    const allMessages = [...messageList];
    const visibleList = allMessages.filter((item) => !(item.hideClass));
    setMessageList(visibleList);
  }

  function isIntersecting() {
    getMessagesFromAPI();
    observer.unobserve($thresholdElement.current);
  }

  function createObserver() {
    observer = createLoadingObserver($thresholdElement.current, isIntersecting);
  }

  function updateMessageList(newMsgList) {
    // To calculate other params (`displayTime` and `photoUrl`) used in the view display
    const nextMsgSet = newMsgList.map(val => {
      const msgDeliveredTime = calculateTimeDifference(
        new Date(),
        new Date(val.updated)
      );
      val.displayTime = msgDeliveredTime;
      val.author.photoUrl = IMG_HOST + val.author.photoUrl;
      return val;
    });
    const updatedMsgList = [...messageList, ...nextMsgSet];
    setMessageList(updatedMsgList);
  }

  function getMessagesFromAPI() {
    getNextMessagesList({ pageToken })
      .then(resp => {
        const { pageToken: newPageToken = "", messages: newMessageList = []} = resp;
        setPageToken(newPageToken);
        updateMessageList(newMessageList);
      })
      .catch(err => {
        setLoaderTxt(err ? err : LOADING_MSG_ERR);
      });
  }

  function handleSwipe(e, index, isRight) {
    if (e.absY < 50) {
      const classToBeAdded = isRight ? "hideRight": "hideLeft";
      const visibileItems = [...messageList];
      visibileItems[index].hideClass = classToBeAdded;
      setMessageList(visibileItems);
      debouncedElementRemoval();
    }
  }

  function handleResize() {
    const newList = currentMsgList.current.map((item) => {
      if (item.height) {
        item.height = undefined;
      }
      return item;
    })
    setMessageList(newList);
  }

  useEffect(() => {
    // Whenever the position of the targetted element Changes create an observer
    if (elementPosition !== 0) {
      createObserver();
    }
  }, [elementPosition]);

  useEffect(() => {
    if (messageList.length > 0) {
      // Height calculation is required to create height based transition when items are reomoved from the DOM
      let hasNewHeight = false;
      const updatedList = messageList.map((msg, index) => {
        if (!msg.height) {
          msg.height = $calloutWrap.current.children[index].offsetHeight;
          hasNewHeight = true;
        }
        return msg;
      });
      if (hasNewHeight) {
        setMessageList(updatedList);
      }
      const position = messageList.length - THRESHOLD_LENGTH_FROM_LAST;
      if (position !== elementPosition) {
        setElementPosition(position);
      }
      currentMsgList.current = messageList;
    }
  }, [messageList]);

  useEffect(() => {
    getMessagesFromAPI();
    window.onresize = () => handleResize();
  }, []);

  return (
    <Fragment>
      <ul ref={$calloutWrap}>
        {
          messageList.length > 0 ?
          messageList.map((msg, index) => {
            const { content = "", displayTime = "", id = "", author = {}, height = "auto", hideClass = ''} = msg;
            const { name = "", photoUrl = "" } = author;
            return (
              <li key={id} className={'callOut ' + hideClass} ref={elementPosition === index ? $thresholdElement : null} style={{ height: height }}>
                <Swipeable onSwipedLeft={(e) => handleSwipe(e, index)} onSwipedRight={(e) => handleSwipe(e, index, true)} {...config} key={id}>
                  <section className="contactInfo">
                    <div className="avatarWrapper dib">
                      <img loading="lazy" className="contactAvatar" height="35px" width="35px" src={photoUrl} alt={name + "_avatar"}/>
                    </div>
                    <div className="dib">
                      <div className="bold name" aria-label="contact-name" title={name}>
                        {name}
                      </div>
                      <div className="time" aria-label="message-received-time">
                        {displayTime}
                      </div>
                    </div>
                  </section>
                  <section className="messageInfo ellipsisLine4" aria-describedby="message-content">
                    {content}
                  </section>
                </Swipeable>
              </li>
            )
          }) :
          <Shimmer/>
        }
      </ul>
      <div aria-label="loading-indicator-message" className={loaderTxt ? "loading" : "noDisplay"}>
        <AiOutlineLoading3Quarters aria-label="loading-spinner" className="loader"/>
        <span className="dib marginL10">{loaderTxt}</span>
      </div>
    </Fragment>
  );
}

export default Messages;