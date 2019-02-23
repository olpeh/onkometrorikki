module Status exposing (Status(..), StatusRequest(..), TranslatedReason, get, requestHandler)

import Http
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Pipeline as JP



-- TYPES


{-| Represents how the request for a status is progressing
-}
type StatusRequest
    = NotAsked
    | Loading
    | Refreshing
    | Success Status
    | Error Http.Error


type Status
    = Working
      --NOTE: Presumably "List String" is NonEmpty? Or could it be empty?
      -- Could also consider a special case for empty reasons,
      -- such as "Reason not known", and even encode that in the type
    | Broken (List (List TranslatedReason))



-- JSON


type alias TranslatedReason =
    { text : String
    , language : String
    }


type alias StatusRequestDTO =
    { broken : Bool
    , reasons : List (List TranslatedReason)
    }


{-| Decode the request to get status.

    There are many ways to do this, some including more Json.Decode-fu than others.
    To make it simpler, we decode straight to a Data Transfer Object (DTO), which
    matches the API, and then write the StatusRequestDTO -> StatusRequest function

    e.g.
        JD.decode requestDecoder {error: "Something"} === Error "Something"
        JD.decode requestDecoder {success: true} === Success Working
        JD.decode requestDecoder {broken: true} === Success Broken

-}
requestDecoder : Decoder StatusRequest
requestDecoder =
    (JD.succeed
        StatusRequestDTO
        |> JP.required "broken" JD.bool
        |> JP.required "reasons" (JD.list (JD.list translatedReasonDecoder))
    )
        |> JD.map dtoToStatusRequest


translatedReasonDecoder : Decoder TranslatedReason
translatedReasonDecoder =
    JD.succeed
        TranslatedReason
        |> JP.required "text" JD.string
        |> JP.required "language" JD.string


{-| Wrap the boolean flags into a nice StatusRequest
TODO: Validate the order and semantics of these with Olavi
-}
dtoToStatusRequest : StatusRequestDTO -> StatusRequest
dtoToStatusRequest { broken, reasons } =
    case broken of
        True ->
            Success (Broken reasons)

        False ->
            Success Working



-- HTTP


get : String -> Http.Request StatusRequest
get apiBaseUrl =
    Http.get
        (apiBaseUrl
            ++ "/status"
        )
        requestDecoder


{-| Transform the HTTP Result into a StatusRequest, and convert to some message type
-}
requestHandler toMsg =
    toMsg << resultToStatusRequest


{-| Transform the HTTP Result into a StatusRequest
-}
resultToStatusRequest : Result Http.Error StatusRequest -> StatusRequest
resultToStatusRequest result =
    case result of
        Ok statusRequest ->
            statusRequest

        Err error ->
            Error error
