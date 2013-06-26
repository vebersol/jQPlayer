package {
	import flash.external.ExternalInterface;

	/**
	 * @author Lucas Teixeira (https://github.com/loteixeira)
	 * @date Feb 22, 2013
	 */
	public class JSEventDispatcher {

		private var listeners:Object;

		public function JSEventDispatcher(addName:String, removeName:String) {
			listeners = {};
			ExternalInterface.addCallback(addName, add);
			ExternalInterface.addCallback(removeName, remove);
		}

		public function dispatch(event:String):void {
			if (!listeners[event])
				return;

			for (var i:uint = 0; i < listeners[event].length; i++)
				ExternalInterface.call(listeners[event][i]);
		}

		private function add(event:String, callback:String):void {
			if (!listeners[event])
				listeners[event] = [];

			listeners[event].push(callback);
		}

		private function remove(event:String, callback:String):void {
			if (!listeners[event])
				return;

			for (var i:uint = 0; listeners[event].length; i++) {
				if (listeners[event][i] == callback) {
					listeners[event].splice(i, 1);
					break;
				}
			}

			if (listeners[event].length == 0)
				listeners[event] = undefined;
		}
	}
}