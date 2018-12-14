module Status exposing (Status(..), StatusRequest(..), get, requestHandler)

import Http
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Pipeline as JP



-- TYPES


{-| Represents how the request for a status is progressing
TODO: Consider "Refreshing" if implemented
-}
type StatusRequest
    = NotAsked
    | Loading
    | Success Status
    | Error String


{-| The concrete status
TODO: Figure out what {error: Maybe String} means
Instead of "Success" and "Broken", we say "Working" and "Broken",
which match the domain.
We could even say "NotBroken", if it matches better, though double
negatives are usually less comprehensible.
-}
type Status
    = Working
      --NOTE: Presumably "List String" is NonEmpty? Or could it be empty?
      -- Could also consider a special case for empty reasons,
      -- such as "Reason not known", and even encode that in the type
    | Broken (List String)



-- JSON


{-| Boolean flags can quickly make the domain a mess.
The real question, though, is how to deal with them.
We cannot change the backend atm.

Two possible ways to do this:

  - Decode straight to StatusRequest
  - Decode to an alias that describes the shape of the JSON technically,
    and then translate that into the StatusRequest

-}
type alias StatusRequestDTO =
    { success : Bool
    , broken : Bool
    , reasons : List String
    , error : Maybe String
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
        |> JP.required "success" JD.bool
        |> JP.required "broken" JD.bool
        |> JP.required "reasons" (JD.list JD.string)
        |> JP.optional "error" (JD.maybe JD.string) Nothing
    )
        |> JD.map dtoToStatusRequest


{-| Wrap the boolean flags into a nice StatusRequest
TODO: Validate the order and semantics of these with Olavi
-}
dtoToStatusRequest : StatusRequestDTO -> StatusRequest
dtoToStatusRequest { success, broken, reasons, error } =
    case error of
        Just err ->
            Error err

        Nothing ->
            case broken of
                True ->
                    Success (Broken reasons)

                False ->
                    case success of
                        True ->
                            Success Working

                        False ->
                            Error "Metro is neither working nor broken"



-- HTTP


get : Http.Request StatusRequest
get =
    Http.get "https://api.onkometrorikki.fi/isitbroken" requestDecoder


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
            Error "Virhe pyynnön lähettämisessä"
