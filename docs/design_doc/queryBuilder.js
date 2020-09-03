/**
 * This file is used to allow easier formatting of the code.
 */

// event bus message sender
const sendMsgToBus = (msg) => console.log(msg);

const queryMachine = Machine(
  {
    id: "queryBuilder",
    initial: "disabled",
    context: {
      count: 0,
    },
    states: {
      /**
       * Map of allowed states for this atom
       */
      disabled: {
        on: {
          /**
           * Event messages are capitalized by convention.
           *
           * @target {sting}: the *only* allowed state to transition to.
           * @actions: {string, string[]} actions to execute before transitioning
           */
          CONSTRAINT_ADDED: {
            target: "idle",
            actions: "addConstraint",
          },
        },
      },
      idle: {
        on: {
          /**
           * An array of constraints makes them guarded conditions. The first
           * condition to match will be chosen. Defaults to the last transition
           * without a conditional
           */
          CONSTRAINT_ADDED: [
            {
              target: "idle",
              cond: (ctx) => ctx.count < 5,
              actions: "addConstraint",
            },
            {
              target: "maxConstraints",
            },
          ],
          CONSTRAINT_REMOVED: [
            {
              target: "disabled",
              cond: (ctx) => ctx.count === 1,
              actions: "removeConstraint",
            },
            {
              target: "idle",
              actions: "removeConstraint",
            },
          ],
        },
      },
      maxConstraints: {
        /**
         * Specifies an action to run on each entry into this state.
         */
        entry: "lockConstraints",
        on: {
          CONSTRAINT_REMOVED: {
            target: "idle",
            actions: ["removeConstraint", "unlockConstraints"],
          },
        },
      },
    },
  },
  /**
   * The second argument to `Machine` accepts an actions object. This allows
   * the state atom to be serializable.
   */
  {
    actions: {
      addConstraint: assign({
        count: (ctx) => ctx.count + 1,
      }),
      removeConstraint: assign({
        count: (ctx) => ctx.count - 1,
      }),

      // will prevent components from adding more constraints
      lockConstraints: () => sendMsgToBus("CONSTRAINTS_LOCKED"),

      // will allow components to submit new constraints
      unlockConstraints: () => sendMsgToBus("CONSTRAINTS_UNLOCKED"),
    },
  }
);
