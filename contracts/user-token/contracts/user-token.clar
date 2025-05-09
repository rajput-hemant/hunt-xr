;; Define the token
(define-fungible-token user-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-already-claimed (err u101))
(define-constant err-not-enough-tokens (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-blacklisted (err u104))
(define-constant err-paused (err u105))

;; Data vars
(define-data-var token-name (string-ascii 32) "UserToken")
(define-data-var token-symbol (string-ascii 10) "USRT")
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var tokens-per-user uint u10000)
(define-data-var is-paused bool false)
(define-data-var max-supply uint u1000000000) ;; 1 billion tokens

;; Data maps
(define-map user-claims principal bool)
(define-map blacklisted-addresses principal bool)
(define-map allowances { owner: principal, spender: principal } uint)

;; Private functions
(define-private (check-blacklist (address principal))
    (default-to false (map-get? blacklisted-addresses address))
)

;; SIP-010 transfer function with blacklist check
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (not (var-get is-paused)) err-paused)
        (asserts! (> amount u0) err-invalid-amount)
        (asserts! (is-eq tx-sender sender) err-owner-only)
        (asserts! (not (check-blacklist sender)) err-blacklisted)
        (asserts! (not (check-blacklist recipient)) err-blacklisted)
        (try! (ft-transfer? user-token amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

;; New approve/allowance functions
(define-public (approve (spender principal) (amount uint))
    (begin
        (asserts! (not (var-get is-paused)) err-paused)
        (asserts! (not (check-blacklist tx-sender)) err-blacklisted)
        (asserts! (not (check-blacklist spender)) err-blacklisted)
        (map-set allowances { owner: tx-sender, spender: spender } amount)
        (ok true)
    )
)

(define-public (transfer-from (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (let ((current-allowance (default-to u0 (map-get? allowances { owner: sender, spender: tx-sender }))))
        (begin
            (asserts! (not (var-get is-paused)) err-paused)
            (asserts! (>= current-allowance amount) err-not-enough-tokens)
            (asserts! (not (check-blacklist sender)) err-blacklisted)
            (asserts! (not (check-blacklist recipient)) err-blacklisted)
            (try! (ft-transfer? user-token amount sender recipient))
            (map-set allowances { owner: sender, spender: tx-sender } (- current-allowance amount))
            (match memo to-print (print to-print) 0x)
            (ok true)
        )
    )
)

;; Enhanced claim tokens function with max supply check
(define-public (claim-tokens)
    (let (
        (caller tx-sender)
        (claim-amount (var-get tokens-per-user))
        (current-supply (ft-get-supply user-token))
    )
        (asserts! (not (var-get is-paused)) err-paused)
        (asserts! (is-none (map-get? user-claims caller)) err-already-claimed)
        (asserts! (not (check-blacklist caller)) err-blacklisted)
        (asserts! (<= (+ current-supply claim-amount) (var-get max-supply)) err-not-enough-tokens)
        (try! (ft-mint? user-token claim-amount caller))
        (map-set user-claims caller true)
        (ok true)
    )
)

;; Admin functions
(define-public (set-paused (paused bool))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (var-set is-paused paused))
    )
)

(define-public (blacklist-address (address principal) (blacklist bool))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (map-set blacklisted-addresses address blacklist))
    )
)

(define-public (set-max-supply (new-max-supply uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (>= new-max-supply (ft-get-supply user-token)) err-invalid-amount)
        (ok (var-set max-supply new-max-supply))
    )
)

;; Enhanced mint function
(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (not (check-blacklist recipient)) err-blacklisted)
        (asserts! (<= (+ (ft-get-supply user-token) amount) (var-get max-supply)) err-not-enough-tokens)
        (try! (ft-mint? user-token amount recipient))
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

(define-read-only (get-allowance (owner principal) (spender principal))
    (ok (default-to u0 (map-get? allowances { owner: owner, spender: spender })))
)

(define-read-only (is-blacklisted (address principal))
    (ok (check-blacklist address))
)

;; Initialize the contract
(begin
    (try! (ft-mint? user-token u0 contract-owner))
)
