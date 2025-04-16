;; Delegate Voting System
;; Allows users to create proposals, vote, and delegate their voting power

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-unauthorized (err u100))
(define-constant err-proposal-exists (err u101))
(define-constant err-proposal-expired (err u102))
(define-constant err-already-voted (err u103))
(define-constant err-invalid-proposal (err u104))

;; Data Variables
(define-data-var proposal-count uint u0)
(define-data-var min-voting-period uint u144) ;; ~1 day in blocks

;; Data Maps
(define-map proposals
    uint 
    {
        title: (string-ascii 50),
        description: (string-ascii 500),
        creator: principal,
        expires-at: uint,
        yes-votes: uint,
        no-votes: uint,
        status: (string-ascii 10)
    }
)

(define-map votes 
    { proposal-id: uint, voter: principal } 
    bool
)

(define-map delegations
    principal 
    principal
)

;; Create a new proposal
(define-public (create-proposal (title (string-ascii 50)) (description (string-ascii 500)) (duration uint))
    (let
        ((proposal-id (var-get proposal-count))
         (expires-at (+ block-height duration)))
        (asserts! (>= duration (var-get min-voting-period)) err-unauthorized)
        (map-set proposals proposal-id
            {
                title: title,
                description: description,
                creator: tx-sender,
                expires-at: expires-at,
                yes-votes: u0,
                no-votes: u0,
                status: "active"
            }
        )
        (var-set proposal-count (+ proposal-id u1))
        (ok proposal-id)
    )
)

;; Vote on a proposal
(define-public (vote (proposal-id uint) (vote-bool bool))
    (let
        ((proposal (unwrap! (map-get? proposals proposal-id) err-invalid-proposal))
         (voter tx-sender))
        (asserts! (< block-height (get expires-at proposal)) err-proposal-expired)
        (asserts! (is-none (map-get? votes {proposal-id: proposal-id, voter: voter})) err-already-voted)
        (map-set votes {proposal-id: proposal-id, voter: voter} vote-bool)
        (if vote-bool
            (map-set proposals proposal-id (merge proposal {yes-votes: (+ (get yes-votes proposal) u1)}))
            (map-set proposals proposal-id (merge proposal {no-votes: (+ (get no-votes proposal) u1)}))
        )
        (ok true)
    )
)

;; Delegate voting power
(define-public (delegate-to (delegate-to principal))
    (begin
        (asserts! (not (is-eq tx-sender delegate-to)) err-unauthorized)
        (ok (map-set delegations tx-sender delegate-to))
    )
)

;; Read-only functions
(define-read-only (get-proposal (proposal-id uint))
    (map-get? proposals proposal-id)
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
    (map-get? votes {proposal-id: proposal-id, voter: voter})
)

(define-read-only (get-delegation (voter principal))
    (map-get? delegations voter)
) 