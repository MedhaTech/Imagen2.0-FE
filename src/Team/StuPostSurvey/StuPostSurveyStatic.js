/* eslint-disable indent */
import { Fragment } from 'react';
import Congo from '../../assets/img/survey1.png';
import { useTranslation } from "react-i18next";

const PostSurveyStatic = () => {
const { t } = useTranslation();

    return (
        <Fragment>
            <div className="text-center">
                <div>
                    <img className="img-fluid imgSize" src={Congo}></img>
                </div>
                <div>
                    <h4 className="common-flex">
                    {t('home.sub')}
                    </h4>
                    <p className="common-flex">
                    {t('home.certi')}
                    </p>
                </div>
            </div>
        </Fragment>
    );
};

export default PostSurveyStatic;
