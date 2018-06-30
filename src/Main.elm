module Main exposing (..)

import Html exposing (Html, text, div, h1, h2, br, ul, li)
import Http
import Json.Decode exposing (list, string, bool, maybe, field)
import Json.Decode.Pipeline exposing (required, optional, resolve, decode)

type Msg
    = GotResponse Status
    | GotError Http.Error


type alias Model =
    { status : Maybe Status
    , error : Maybe String
    , loading: Bool
    }

type alias Status =
    { success : Bool
    , broken : Bool
    , reasons : List String
    , error : Maybe String
    }


model : Model
model =
    { status = Nothing
    , error = Nothing
    , loading = True
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotResponse status ->
            ( { model | status = Just(status), loading = False }, Cmd.none )

        GotError error ->
            ( { model | error = Just(toString error), loading = False }, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Onko Länsimetro rikki?" ]
        , statusView model.status
        , if model.loading == True then
            text "Ladataan statusta..."
          else
            text ""
        , errorView model.error
        ]


statusView : Maybe Status -> Html msg
statusView status =
    case status of
        Just status -> currentStatusView status
        Nothing -> text ""


currentStatusView : Status -> Html msg
currentStatusView status =
    div []
        [
            if status.broken == True then
                h2 [] [ text "Kyllä!" ]
            else
                h2 [] [ text "Ei!" ]
        , br [] []
        , reasonsView status.reasons
        , case status.error of
            Just error -> text error
            Nothing -> text ""
        ]


errorView : Maybe String -> Html msg
errorView error =
    case error of
        Just error -> text error
        Nothing -> text ""


reasonsView : List String -> Html msg
reasonsView reasons =
    reasons
        |> List.map reasonView
        |> ul []


reasonView : String -> Html msg
reasonView reason =
    li [] [ text reason ]


init : ( Model, Cmd Msg )
init =
    ( model
    , Http.send handler (Http.get "https://onkolansimetrorikki.herokuapp.com/api/isitbroken" decoder)
    )


decoder : Json.Decode.Decoder Status
decoder =
    decode Status
        |> required "success" bool
        |> required "broken" bool
        |> required "reasons" (list string)
        |> optional "error" (maybe string) Nothing

handler : Result Http.Error Status -> Msg
handler result =
    case result of
        Ok status ->
            GotResponse status

        Err error ->
            GotError error


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


main : Program Never Model Msg
main =
    Html.program
        { view = view
        , init = init
        , update = update
        , subscriptions = always Sub.none
        }
