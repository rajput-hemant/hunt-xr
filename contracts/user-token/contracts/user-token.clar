;; Define the token
(define-fungible-token user-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-already-claimed (err u101))
(define-constant err-not-enough-tokens (err u102))

;; Data vars
(define-data-var token-name (string-ascii 32) "UserToken")
(define-data-var token-symbol (string-ascii 10) "USRT")
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var tokens-per-user uint u10000)

;; Data maps
(define-map user-claims principal bool)

;; SIP-010 transfer function
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) err-owner-only)
        (try! (ft-transfer? user-token amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

;; Claim tokens function
(define-public (claim-tokens)
    (let ((caller tx-sender))
        (asserts! (is-none (map-get? user-claims caller)) err-already-claimed)
        (try! (ft-mint? user-token (var-get tokens-per-user) caller))
        (map-set user-claims caller true)
        (ok true)
    )
)

;; Read-only functions
(define-read-only (get-name)
    (ok (var-get token-name))
)

(define-read-only (get-symbol)
    (ok (var-get token-symbol))
)

(define-read-only (get-decimals)
    (ok u6)
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance user-token who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply user-token))
)

(define-read-only (get-token-uri)
    (ok (var-get token-uri))
)

;; Set token URI (only contract owner)
(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (var-set token-uri new-uri))
    )
)

;; Initialize the contract
(begin
    (try! (ft-mint? user-token u0 contract-owner))
)

;; Add this function
(define-public (mint? (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (try! (ft-mint? user-token amount recipient)))
    )
)
