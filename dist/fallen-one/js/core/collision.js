// js/core/collision.js - Hitbox, Hurtbox, Pushbox & Priority Collision System

export class CollisionSystem {
    static testAABB(boxA, boxB) {
        return (
            boxA.x < boxB.x + boxB.w &&
            boxA.x + boxA.w > boxB.x &&
            boxA.y < boxB.y + boxB.h &&
            boxA.y + boxA.h > boxB.y
        );
    }

    // Resolve Pushbox body collisions so fighters do not walk through each other
    static resolvePushboxes(f1, f2) {
        const b1 = f1.getPushbox();
        const b2 = f2.getPushbox();

        if (this.testAABB(b1, b2)) {
            const overlapX = (b1.x + b1.w / 2) - (b2.x + b2.w / 2);
            const minSeparation = (b1.w + b2.w) / 2;
            const diff = minSeparation - Math.abs(overlapX);

            if (diff > 0) {
                const shift = diff / 2;
                if (overlapX > 0) {
                    f1.x += shift;
                    f2.x -= shift;
                } else {
                    f1.x -= shift;
                    f2.x += shift;
                }
            }
        }
    }

    // Check fighter attacks against opponent hurtboxes
    static checkHit(attacker, defender) {
        const attackBox = attacker.getActiveHitbox();
        if (!attackBox || attackBox.hasHit) return null;

        const hurtboxes = defender.getHurtboxes();
        for (const hurtbox of hurtboxes) {
            if (this.testAABB(attackBox, hurtbox)) {
                attackBox.hasHit = true;
                const isCounter = defender.isAttacking && defender.attackPhase === 'STARTUP';
                return {
                    hitPoint: {
                        x: (attackBox.x + attackBox.w / 2 + hurtbox.x + hurtbox.w / 2) / 2,
                        y: (attackBox.y + attackBox.h / 2 + hurtbox.y + hurtbox.h / 2) / 2
                    },
                    attack: attacker.currentAttackData,
                    isCounter
                };
            }
        }
        return null;
    }

    // Check projectile against defender hurtboxes
    static checkProjectileHit(projectile, defender) {
        const hurtboxes = defender.getHurtboxes();
        const pBox = projectile.getHitbox();

        for (const hurtbox of hurtboxes) {
            if (this.testAABB(pBox, hurtbox)) {
                return {
                    hitPoint: {
                        x: (pBox.x + pBox.w / 2 + hurtbox.x + hurtbox.w / 2) / 2,
                        y: (pBox.y + pBox.h / 2 + hurtbox.y + hurtbox.h / 2) / 2
                    },
                    attack: projectile.attackData
                };
            }
        }
        return null;
    }

    // Check projectile clashing
    static checkProjectileClash(p1, p2) {
        return this.testAABB(p1.getHitbox(), p2.getHitbox());
    }
}
