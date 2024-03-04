import Toaster from "./toaster";

const defaultDuration = 3;
let toastInstance: any;
let key = 1;

interface IToastArgs {
  key?: number;
  content: string;
  duration?: number;
  onClose?: () => void;
}

export type ThenableArgument = (val: any) => void;

export function getKeyThenIncreaseKey() {
  return key++;
}

function getToastInstance(arg: IToastArgs, callback: (i: any) => void) {
  if (toastInstance) {
    callback(toastInstance);
    return toastInstance;
  }

  Toaster.newInstance((instance: any) => {
    if (toastInstance) {
      callback(toastInstance);
      return;
    }
    toastInstance = instance;
    callback(instance);
  });
}

function notice(args: IToastArgs) {
  if (__isBrowser__) {

    const duration = args.duration !== undefined ? args.duration : defaultDuration;
    const target = args.key || getKeyThenIncreaseKey();
    const closePromise = new Promise(resolve => {
      const callback = () => {
        if (typeof args.onClose === "function") {
          args.onClose();
        }
        return resolve(true);
      };
      getToastInstance(args, instance => {
        instance.toast({
          key: target,
          duration,
          content: () => {
            return (
              <span>{args.content}</span>
            );
          },
          onClose: callback
        });
      });
    });
    const result: any = () => {
      if (toastInstance) {
        toastInstance.removeNotice(target);
      }
    };
    result.then = async (filled: ThenableArgument, rejected: ThenableArgument) => closePromise.then(filled, rejected);
    result.promise = closePromise;
    return result;
  } else {
    console.log(args.content);
  }
}

const toast = {
  info: notice
};

export default toast;
