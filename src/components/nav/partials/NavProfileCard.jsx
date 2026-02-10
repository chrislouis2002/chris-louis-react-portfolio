import "./NavProfileCard.scss"
import React, {useEffect, useState} from 'react'
import {Card} from "react-bootstrap"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"
import ImageView from "/src/components/generic/ImageView.jsx"
import StatusCircle from "/src/components/generic/StatusCircle.jsx"
import TextTyper from "/src/components/generic/TextTyper.jsx"
import AudioButton from "/src/components/buttons/AudioButton.jsx"

function NavProfileCard({ profile, expanded }) {
    const language = useLanguage()
    const navigation = useNavigation()
    const utils = useUtils()

    const expandedClass = expanded ?
        `` :
        `nav-profile-card-shrink`

    const name = profile.name
    const stylizedName = language.getTranslation(profile.locales, "localized_name_stylized", null) ||
        language.getTranslation(profile.locales, "localized_name", null) ||
        name

    let roles = language.getTranslation(profile.locales, "roles", [])
    if(utils.storage.getWindowVariable("suspendAnimations") && roles.length > 2)
        roles = [roles[0]]

    const profilePictureUrl = language.parseJsonText(profile.profilePictureUrl)
    const [showFullImage, setShowFullImage] = useState(false)


    const statusCircleVisible = Boolean(profile.statusCircleVisible)
    const statusCircleVariant = statusCircleVisible ?
        profile.statusCircleVariant :
        ""

    const statusCircleHoverMessage = statusCircleVisible ?
        language.getTranslation(profile.locales, profile.statusCircleHoverMessage) :
        null

    const statusCircleSize = expanded ?
        StatusCircle.Sizes.DEFAULT :
        StatusCircle.Sizes.SMALL

    const namePronunciationIpa = language.getTranslation(profile.locales, "name_pronunciation_ipa", null)
    const namePronunciationAudioUrl = language.getTranslation(profile.locales, "name_pronunciation_audio_url", null)
    const namePronunciationButtonVisible = namePronunciationIpa || namePronunciationAudioUrl

    const navProfileCardNameClass = namePronunciationButtonVisible ?
        `nav-profile-card-name-with-audio-button` :
        ``

    const _onStatusBadgeClicked = () => {
        navigation.navigateToSectionWithId("contact")
    }

    return (
        <Card className={`nav-profile-card ${expandedClass}`}>
           <div
    onClick={() => setShowFullImage(true)}
    style={{ cursor: "pointer",
               transition: "transform 0.2s"
     }}
     onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
>
    <ImageView
        src={profilePictureUrl}
        className={`nav-profile-card-avatar`}
        hideSpinner={true}
        alt={name}
    />
</div>


            {statusCircleVisible && (
                <StatusCircle className={`nav-profile-card-status-circle`}
                              variant={statusCircleVariant}
                              message={statusCircleHoverMessage}
                              size={statusCircleSize} onClick={_onStatusBadgeClicked}/>
            )}

            <div className={`nav-profile-card-info`}>
                <h1 className={`nav-profile-card-name ${navProfileCardNameClass}`}>
                    <span dangerouslySetInnerHTML={{__html: stylizedName}}/>
                    {namePronunciationButtonVisible && (
                        <AudioButton url={namePronunciationAudioUrl}
                                     tooltip={namePronunciationIpa}
                                     size={AudioButton.Sizes.DYNAMIC_FOR_NAV_TITLE}/>
                    )}
                </h1>

                {roles?.length > 1 && (
                    <TextTyper strings={roles}
                               id={`role-typer`}
                               className={`nav-profile-card-role`}/>
                )}

                {roles?.length === 1 && (
                    <div className={`nav-profile-card-role`}
                         dangerouslySetInnerHTML={{__html: roles[0]}}/>
                )}
            </div>

            {showFullImage && (
    <div
        onClick={() => setShowFullImage(false)}
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "pointer"
        }}
    >
        <img
            src={utils.file.resolvePath(profilePictureUrl)}
            alt="Full Profile"
            style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "12px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
            }}
        />
    </div>
)}

        </Card>
    )
}

export default NavProfileCard