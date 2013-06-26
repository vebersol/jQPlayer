package  {
	
	import flash.display.LoaderInfo;
	import flash.external.ExternalInterface;
	
	public class Util {
		
		private var _rootObject:Object;

		public function Util(rootObject:Object):void {
			_rootObject = rootObject;
		}
		
		public function getFlashVar(prop:String):String {
			var paramObj:Object = LoaderInfo(_rootObject.loaderInfo).parameters;
			return paramObj[prop];
		}
		
		public function cl(message:String):void {
			//ExternalInterface.call( "console.log" , message);
		}

	}
	
}
