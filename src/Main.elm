port module Main exposing (Model, Msg(..), init, main, subscriptions, update, view, viewError, viewFooter, viewReason, viewReasons, viewStatus, viewStatusRequest, viewThemeToggle)

import Browser
import Config exposing (Config)
import FeatherIcons
import Html exposing (Html, br, button, div, footer, h1, h2, li, main_, span, text, ul)
import Html.A11y exposing (ariaHidden, ariaLabel, ariaPressed, focusable)
import Html.Attributes exposing (attribute, class, disabled, title, value)
import Html.Events exposing (onClick)
import Http exposing (..)
import Markdown
import Status exposing (Status(..), StatusRequest(..))
import Task exposing (Task)
import Theme exposing (Theme, decode)
import Time
import Translations exposing (..)


port setLanguage : String -> Cmd msg



-- MODEL


type alias Model =
    { statusRequest : StatusRequest
    , lastUpdated : Time.Posix
    , zone : Time.Zone
    , theme : Theme
    , language : Translations.Language
    , config : Config
    }


init : Config -> ( Model, Cmd Msg )
init config =
    ( { statusRequest = Status.Loading
      , lastUpdated = Time.millisToPosix 0
      , zone = Time.utc
      , theme =
            case config.theme of
                Just str ->
                    Theme.decode str

                _ ->
                    Theme.Light
      , language =
            config.language
                |> Maybe.withDefault "FI"
                |> Translations.stringToLanguage
                |> Maybe.withDefault Translations.Finnish
      , config = config
      }
    , Task.perform AdjustTimeZone Time.here
    )



-- MSG


type Msg
    = GotStatus StatusRequest
    | ChangeTheme Theme
    | Refresh Time.Posix
    | UpdateTime Time.Posix
    | AdjustTimeZone Time.Zone
    | SetLanguage Language
    | NoOp



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        t =
            translate model.language
    in
    case msg of
        GotStatus statusRequest ->
            ( { model | statusRequest = statusRequest }, Task.perform UpdateTime Time.now )

        ChangeTheme newTheme ->
            ( { model | theme = newTheme }, Theme.notifyChanged newTheme )

        Refresh _ ->
            ( { model | statusRequest = Status.Refreshing }, Http.send (Status.requestHandler GotStatus) (Status.get model.config.apiBaseUrl) )

        UpdateTime newTime ->
            ( { model | lastUpdated = newTime }
            , Cmd.none
            )

        AdjustTimeZone newZone ->
            ( { model | zone = newZone }
            , Task.perform Refresh Time.now
            )

        SetLanguage language ->
            let
                nextModel =
                    { model | language = language }
            in
            ( nextModel, setLanguage (Translations.languageToString nextModel.language) )

        NoOp ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    let
        t =
            translate model.language

        tText =
            text << t
    in
    div [ class ("container color-fg " ++ Theme.toClass model.theme) ]
        [ main_ [ class "main" ]
            [ div []
                [ languageSelect model.language
                , h1 []
                    [ tText PageTitle ]
                , div
                    [ class "status" ]
                    [ viewStatusRequest model.language model.statusRequest model.lastUpdated model.zone ]
                ]
            , div [ class "actions" ]
                [ viewRefreshButton t model.statusRequest model.theme
                , viewThemeToggle t model.theme
                ]
            ]
        , footer [] [ viewFooter ]
        ]


viewStatusRequest : Translations.Language -> StatusRequest -> Time.Posix -> Time.Zone -> Html msg
viewStatusRequest lang statusRequest lastUpdated timeZone =
    let
        t =
            translate lang

        tText =
            text << t
    in
    case statusRequest of
        NotAsked ->
            text ""

        Loading ->
            span [] [ tText LoadingStatusText ]

        Refreshing ->
            span [] [ tText RefreshingText ]

        Success status ->
            viewStatus lang status lastUpdated timeZone

        Error error ->
            viewError t error


viewStatus : Translations.Language -> Status -> Time.Posix -> Time.Zone -> Html msg
viewStatus lang status lastUpdated timeZone =
    let
        t =
            translate lang
    in
    case status of
        Working ->
            div []
                [ h2 [] [ text (t WorkingText ++ "!") ]
                , viewLastUpdated t lastUpdated timeZone
                ]

        Broken reasons ->
            div []
                [ h2 [ class "broken" ] [ text (t BrokenText ++ "!") ]
                , viewReasons lang reasons
                , viewLastUpdated t lastUpdated timeZone
                ]


viewLastUpdated : T -> Time.Posix -> Time.Zone -> Html msg
viewLastUpdated t lastUpdated timeZone =
    let
        tText =
            text << t
    in
    let
        hour =
            String.padLeft 2 '0' (String.fromInt (Time.toHour timeZone lastUpdated))

        minute =
            String.padLeft 2 '0' (String.fromInt (Time.toMinute timeZone lastUpdated))

        second =
            String.padLeft 2 '0' (String.fromInt (Time.toSecond timeZone lastUpdated))

        lastUpdatedTimeText =
            ": " ++ hour ++ ":" ++ minute ++ ":" ++ second
    in
    span [ class "last-updated" ] [ tText LastUpdatedText, text lastUpdatedTimeText ]


viewError : T -> Http.Error -> Html msg
viewError t err =
    let
        tText =
            text << t
    in
    case err of
        Http.NetworkError ->
            tText ErrorNetwork

        Http.Timeout ->
            tText ErrorTimeout

        Http.BadUrl url ->
            tText ErrorBadUrl

        Http.BadStatus status ->
            tText ErrorBadStatus

        Http.BadPayload _ _ ->
            tText ErrorBadPayload


viewReasons : Translations.Language -> List (List Status.TranslatedReason) -> Html msg
viewReasons lang reasons =
    -- Handle empty reasons by not adding the ul, semantically.
    -- Could also consider a special case for empty reasons,
    -- such as "Reason not known", and even encode that in the type
    case reasons of
        [] ->
            text ""

        rs ->
            rs
                |> List.map (\reason -> viewReason lang reason)
                |> div []


viewReason : Translations.Language -> List Status.TranslatedReason -> Html msg
viewReason lang reasons =
    reasons
        |> List.filter (\reason -> reason.language == String.toLower (languageToString lang))
        |> List.map (\reason -> li [] [ text reason.text ])
        |> ul [ class "reasons" ]


viewRefreshButton : T -> StatusRequest -> Theme -> Html Msg
viewRefreshButton t statusRequest theme =
    let
        tText =
            text << t

        tTitle =
            title << t

        isRefreshing =
            case statusRequest of
                Loading ->
                    True

                Refreshing ->
                    True

                _ ->
                    False
    in
    button
        [ class "button-reset refresh-button enhanced-outline"
        , class
            (if isRefreshing then
                "refreshing"

             else
                ""
            )
        , class (Theme.toClass (Theme.invert theme))

        -- Instead of disabling the button, remove the onClick handler when submitting
        , onClick
            (case isRefreshing of
                True ->
                    NoOp

                False ->
                    Refresh (Time.millisToPosix 0)
            )
        ]
        [ span [ class "refresh-button-label", tTitle RefreshButtonTitleText ] [ tText DoRefreshText ]
        , FeatherIcons.refreshCw
            |> FeatherIcons.toHtml [ ariaHidden True, focusable False ]
        ]


{-| The Theme Toggle is a button that communicates whether it is pressed
(as a binary "is dark" state). This simplifies the accessibility roles,
but you would have to change it if you added more themes.
@see <https://inclusive-components.design/a-theme-switcher/>
-}
viewThemeToggle : T -> Theme -> Html Msg
viewThemeToggle t theme =
    let
        tText =
            text << t

        tTitle =
            title << t

        -- Boolean representation of theme being dark
        isDarkTheme =
            theme == Theme.Dark

        inverseTheme =
            Theme.invert theme
    in
    button
        [ ariaPressed isDarkTheme
        , ariaLabel "Dark mode"
        , class "button-reset theme-button enhanced-outline"
        , tTitle ThemeToggleButtonTitleText

        -- show the button in the inverted colours
        , class (Theme.toClass inverseTheme)
        , onClick (ChangeTheme inverseTheme)
        ]
        [ FeatherIcons.moon
            |> FeatherIcons.toHtml [ ariaHidden True, focusable False ]
        ]


languageSelect : Language -> Html Msg
languageSelect currentLanguage =
    let
        optionAttrs lang =
            [ value (languageToString lang)
            , Html.Events.onClick (SetLanguage lang)
            , class
                (if currentLanguage == lang then
                    "button-reset enhanced-outline is-current"

                 else
                    "button-reset enhanced-outline"
                )
            ]
    in
    allLanguages
        |> List.map (\lang -> button (optionAttrs lang) [ text (languageToString lang) ])
        |> div [ class "language-select" ]


viewFooter : Html msg
viewFooter =
    Markdown.toHtml [] """
* Built by [0lpeh](https://twitter.com/0lpeh) |
* Repository available at [GitHub](https://github.com/olpeh/onkometrorikki) |
* Follow [@onkometrorikki](https://twitter.com/onkometrorikki)
"""



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    -- Re-fetch status every 30s
    Time.every 30000 Refresh



-- MAIN


main : Program Config Model Msg
main =
    Browser.element
        { view = view
        , init = init
        , update = update
        , subscriptions = subscriptions
        }
