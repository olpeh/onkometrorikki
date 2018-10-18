module Html.A11y exposing (ariaHidden, ariaLabel, ariaPressed, boolToAttr, focusable)

import Html exposing (Attribute)
import Html.Attributes exposing (attribute)



{-

   Utilities for well-typed, accessible HTML markup.

-}


{-| Typed, convenient aria-checked attribute
-}
ariaPressed : Bool -> Attribute msg
ariaPressed =
    boolToAttr >> attribute "aria-pressed"


ariaLabel : String -> Attribute msg
ariaLabel =
    attribute "aria-label"


ariaHidden : Bool -> Attribute msg
ariaHidden =
    boolToAttr >> attribute "aria-hidden"


focusable : Bool -> Attribute msg
focusable =
    boolToAttr >> attribute "focusable"


{-| Convert a bool to a boolean attribute value,
e.g. boolToString False == "false"
-}
boolToAttr : Bool -> String
boolToAttr bool =
    case bool of
        True ->
            "true"

        False ->
            "false"
