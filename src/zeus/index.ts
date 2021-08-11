/* eslint-disable */

import { AllTypesProps, ReturnTypes } from './const';
type ZEUS_INTERFACES = never
type ZEUS_UNIONS = never

export type ValueTypes = {
    /** RFC3339Date is a RFC3339 formated date-time string */
["RFC3339Date"]:unknown;
	/** Connection object containing list of faker sources */
["FakerSourceConnection"]: AliasType<{
	/** Connection pageInfo */
	pageInfo?:ValueTypes["PageInfo"],
	/** List of sources returned by connection */
	sources?:ValueTypes["FakerSource"],
		__typename?: true
}>;
	/** type object node */
["ProjectOps"]: AliasType<{
	/** Create project in cloud */
	createCloudDeployment?:true,
	/** Boolean object node */
	delete?:true,
deployCodeToCloud?: [{	input:ValueTypes["DeployCodeToCloudInput"]},true],
	/** deploy project to faker */
	deployToFaker?:true,
removeSources?: [{	files?:string[]},true],
renameSources?: [{	files?:ValueTypes["RenameFileInput"][]},true],
update?: [{	in?:ValueTypes["UpdateProject"]},true],
		__typename?: true
}>;
	/** Update project payload */
["UpdateProject"]: {
	/** ID of project to be updated */
	project?:string,
	/** New description for project */
	description?:string,
	/** List of tags for project */
	tags?:string[],
	/** Set project visiblity */
	public?:boolean
};
	/** Teams connection */
["TeamConnection"]: AliasType<{
	/** Pagination info used in next fetch */
	pageInfo?:ValueTypes["PageInfo"],
	/** List of teams returned by current page in connection */
	teams?:ValueTypes["Team"],
		__typename?: true
}>;
	/** Team object */
["Team"]: AliasType<{
	/** Unique team id */
	id?:true,
member?: [{	username:string},ValueTypes["Member"]],
members?: [{	last?:string,	limit?:number},ValueTypes["MemberConnection"]],
	/** Team name */
	name?:true,
	/** Team's namespace */
	namespace?:ValueTypes["Namespace"],
	/** A plan ID of a plan associated with team */
	planID?:true,
		__typename?: true
}>;
	/** Project connection object

Used with paginated listing of projects */
["ProjectConnection"]: AliasType<{
	/** Current connection page info */
	pageInfo?:ValueTypes["PageInfo"],
	/** List of projects in connection */
	projects?:ValueTypes["Project"],
		__typename?: true
}>;
	["Subscription"]: AliasType<{
	/** Cancel subscription URL */
	cancelURL?:true,
	/** Subscription expiration date */
	expiration?:true,
	/** Number of seats in subscription */
	quantity?:true,
	/** List of seats in subscription */
	seats?:ValueTypes["UserConnection"],
	/** Status of subscription */
	status?:true,
	/** Subscription unique id */
	subscriptionID?:true,
	/** Subscription plan unique id */
	subscriptionPlanID?:true,
	/** Update subscription URL */
	updateURL?:true,
		__typename?: true
}>;
	["ChangeSubscriptionInput"]: {
	subscriptionID:number,
	subscriptionPlanID?:number
};
	/** ProjectsSortInput defines how projects from listProjects should be sorted. */
["ProjectsSortInput"]: {
	/** Sort projects by creation date */
	createdAt?:ValueTypes["SortOrder"],
	/** Sort by name */
	name?:ValueTypes["SortOrder"],
	/** Sort by id */
	id?:ValueTypes["SortOrder"],
	/** Sort by owner */
	owner?:ValueTypes["SortOrder"],
	/** Sort by visisbility */
	public?:ValueTypes["SortOrder"],
	/** Sort by slug */
	slug?:ValueTypes["SortOrder"],
	/** Sort by tag */
	tags?:ValueTypes["SortOrder"],
	/** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
	team?:ValueTypes["SortOrder"]
};
	["UserConnection"]: AliasType<{
	/** Current connection page info */
	pageInfo?:ValueTypes["PageInfo"],
	/** List of projects in connection */
	users?:ValueTypes["User"],
		__typename?: true
}>;
	/** Team operations */
["TeamOps"]: AliasType<{
addMember?: [{	username:string,	role:ValueTypes["Role"],	loginCallback?:string},ValueTypes["Member"]],
createProject?: [{	public?:boolean,	name:string},ValueTypes["Project"]],
	/** Delete team */
	delete?:true,
	/** Unique team id */
	id?:true,
member?: [{	username:string},ValueTypes["MemberOps"]],
members?: [{	last?:string,	limit?:number},ValueTypes["MemberConnection"]],
	/** Team name */
	name?:true,
	/** Team's namespace */
	namespace?:ValueTypes["Namespace"],
	/** A plan ID of a plan associated with team */
	planID?:true,
project?: [{	id:string},ValueTypes["ProjectOps"]],
		__typename?: true
}>;
	["RenameFileInput"]: {
	dst:string,
	src:string
};
	/** Team member role */
["Role"]:Role;
	/** Team member ops */
["MemberOps"]: AliasType<{
	/** Boolean object node */
	delete?:true,
update?: [{	role?:ValueTypes["Role"]},true],
		__typename?: true
}>;
	/** Paginated members list */
["MemberConnection"]: AliasType<{
	/** List of members in this connection */
	members?:ValueTypes["Member"],
	/** pageInfo for member connection */
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: true
}>;
	["FileServerCredentials"]:unknown;
	/** A source object */
["FakerSource"]: AliasType<{
	/** File checksum */
	checksum?:true,
	contents?:true,
	/** Name of source file */
	filename?:true,
	/** Return an url by which source file can be accessed */
	getUrl?:true,
		__typename?: true
}>;
	/** Team member */
["Member"]: AliasType<{
	/** Member email */
	email?:true,
	/** Member role */
	role?:true,
	/** Member username */
	username?:true,
		__typename?: true
}>;
	["SubscriptionConnection"]: AliasType<{
	/** Current conenction page info */
	pageInfo?:ValueTypes["PageInfo"],
	/** List of subscriptions in connection */
	subscriptions?:ValueTypes["Subscription"],
		__typename?: true
}>;
	/** Checkout data needed to begin payment process */
["PredictCheckoutInput"]: {
	/** Quantity of subscriptions that user wants */
	quantity?:number,
	/** Optional discount coupon */
	coupon?:string,
	/** An id of a chosen subscription plan */
	planID:string
};
	["DeployCodeToCloudURIKind"]:DeployCodeToCloudURIKind;
	["Payment"]: AliasType<{
	/** Amount paid */
	amount?:true,
	/** Currency in which payment was made */
	currency?:true,
	/** Date indicates a when the payment was made */
	date?:true,
	/** URL from which user can download invoice */
	receiptURL?:true,
	/** ID of subscription for which payment was made */
	subscriptionID?:true,
		__typename?: true
}>;
	/** Amount is a number that gives precise representation of real numbers */
["Decimal"]:unknown;
	["DeployCodeToCloudEnv"]:DeployCodeToCloudEnv;
	/** Namespace is a root object containing projects belonging
to a team or user */
["Namespace"]: AliasType<{
project?: [{	name:string},ValueTypes["Project"]],
projects?: [{	last?:string,	limit?:number},ValueTypes["ProjectConnection"]],
	/** True if namespace is public */
	public?:true,
	/** Namespace part of the slug */
	slug?:true,
		__typename?: true
}>;
	/** Endpoint returnes a full path to the project without host */
["Endpoint"]: AliasType<{
	/** Full project uri without host */
	uri?:true,
		__typename?: true
}>;
	/** Editor user */
["User"]: AliasType<{
	/** User's account type */
	accountType?:true,
	/** Unique user id */
	id?:true,
	/** User's namespace */
	namespace?:ValueTypes["Namespace"],
	/** User's subscriptions */
	subscriptions?:ValueTypes["SubscriptionConnection"],
	/** Unique username */
	username?:true,
		__typename?: true
}>;
	/** Vat information of a user */
["VatInput"]: {
	/** Vat number */
	number?:string,
	/** Vat company name */
	companyName?:string,
	/** Vat company street address */
	street?:string,
	/** Vat company city address */
	city?:string,
	/** Vat company state address. Optional. */
	state?:string,
	/** Vat company country address. */
	country?:string,
	/** Vat company post code address. */
	postCode?:string
};
	["DeployCodeToCloudInput"]: {
	codeURI:string,
	kind?:ValueTypes["DeployCodeToCloudURIKind"],
	env?:ValueTypes["DeployCodeToCloudEnv"],
	secrets?:ValueTypes["Secret"][],
	node14Opts?:ValueTypes["DeployCodeToCloudNode14Opts"]
};
	/** Root query type */
["Query"]: AliasType<{
checkoutData?: [{	data:ValueTypes["CheckoutDataInput"]},true],
	/** Returns true if the user is logged in and has verified email */
	emailVerified?:true,
fileServerCredentials?: [{	project?:string},true],
findProjects?: [{	query:string,	last?:string,	limit?:number},ValueTypes["ProjectConnection"]],
findProjectsByTag?: [{	tag:string,	last?:string,	limit?:number},ValueTypes["ProjectConnection"]],
getNamespace?: [{	slug:string},ValueTypes["Namespace"]],
getProject?: [{	project:string},ValueTypes["Project"]],
getTeam?: [{	name:string},ValueTypes["Team"]],
getUser?: [{	username:string},ValueTypes["User"]],
listProjects?: [{	owned?:boolean,	last?:string,	limit?:number,	sort?:(ValueTypes["ProjectsSortInput"] | undefined)[]},ValueTypes["ProjectConnection"]],
myTeams?: [{	last?:string,	limit?:number},ValueTypes["TeamConnection"]],
	/** List user payments */
	payments?:ValueTypes["Payment"],
predictCheckout?: [{	data:ValueTypes["PredictCheckoutInput"]},ValueTypes["PredictCheckout"]],
		__typename?: true
}>;
	/** PageInfo contains information about connection page */
["PageInfo"]: AliasType<{
	/** last element in connection */
	last?:true,
	/** limit set while quering */
	limit?:true,
	/** if next is false then client recieved all available data */
	next?:true,
		__typename?: true
}>;
	/** Sort order defines possible ordering of sorted outputs */
["SortOrder"]:SortOrder;
	/** Customer data for checkout information */
["CustomerInput"]: {
	/** User's post code */
	postCode?:string,
	/** Must be true for marketing to be allowed */
	marketingConsent?:boolean,
	/** User's email address */
	email?:string,
	/** User's country */
	country?:string
};
	["Secret"]: {
	name:string,
	value?:string
};
	/** Request header */
["Header"]: AliasType<{
	/** Header name */
	key?:true,
	/** Header value */
	value?:true,
		__typename?: true
}>;
	/** Project type */
["Project"]: AliasType<{
	/** Return creation time stamp of a project */
	createdAt?:true,
	/** Project description */
	description?:true,
	/** Is project enabled */
	enabled?:true,
	/** Project endpoint contains a slug under which project can be reached

For example https://app.graphqleditor.com/{endpoint.uri}/ */
	endpoint?:ValueTypes["Endpoint"],
	/** Unique project id */
	id?:true,
	/** Is project deployed to cloud */
	inCloud?:true,
	/** Is project mocked by faker backend */
	mocked?:true,
	/** Project name */
	name?:true,
	/** Project owner

Can be null if project belongs to a team */
	owner?:ValueTypes["User"],
	/** True if project is public */
	public?:true,
	/** Project part of the slug */
	slug?:true,
sources?: [{	last?:string,	limit?:number},ValueTypes["FakerSourceConnection"]],
	/** Project tags */
	tags?:true,
	/** Team to which project belongs

Can be null if project belongs to a user */
	team?:ValueTypes["Team"],
		__typename?: true
}>;
	/** PredictCheckout represents payment prediction for checkout data */
["PredictCheckout"]: AliasType<{
	/** Predicted checkout price */
	price?:true,
	/** Predicted number of trial days */
	trialDays?:true,
		__typename?: true
}>;
	/** PaymentDate is a string in a format 'YYYY-MM-DD' */
["PaymentDate"]:unknown;
	["Mutation"]: AliasType<{
changeSubscription?: [{	in:ValueTypes["ChangeSubscriptionInput"]},true],
createCloudDeployment?: [{	id:string},true],
createProject?: [{	public?:boolean,	name:string},ValueTypes["Project"]],
createTeam?: [{	namespace:string,	name:string},ValueTypes["TeamOps"]],
createUser?: [{	namespace:string,	public?:boolean},ValueTypes["User"]],
	/** Delete account */
	deleteAccount?:true,
deployCodeToCloud?: [{	id:string,	opts:ValueTypes["DeployCodeToCloudInput"]},true],
deployToFaker?: [{	id:string},true],
removeProject?: [{	project:string},true],
sync?: [{	source:string,	target:string},true],
team?: [{	id:string},ValueTypes["TeamOps"]],
updateProject?: [{	in?:ValueTypes["UpdateProject"]},true],
updateSources?: [{	sources?:ValueTypes["NewSource"][],	project:string},ValueTypes["SourceUploadInfo"]],
		__typename?: true
}>;
	["DeployCodeToCloudNode14Opts"]: {
	buildScript?:string
};
	/** Source upload info object */
["SourceUploadInfo"]: AliasType<{
	/** Source file name */
	filename?:true,
	/** List of headers that must be included in PUT request */
	headers?:ValueTypes["Header"],
	/** String with url used in PUT request */
	putUrl?:true,
		__typename?: true
}>;
	/** Defines user's account type */
["AccountType"]:AccountType;
	/** Checkout data needed to begin payment process */
["CheckoutDataInput"]: {
	/** An id of a chosen subscription plan */
	planID:string,
	/** Quantity of subscriptions that user wants */
	quantity?:number,
	/** Customer data */
	customer?:ValueTypes["CustomerInput"],
	/** Vat data */
	vat?:ValueTypes["VatInput"],
	/** Optional discount coupon */
	coupon?:string,
	/** URL to which user should be redirected after successful transaction */
	successURL?:string,
	/** URL to which user should be redirected after failed transaction */
	cancelURL?:string
};
	/** New source payload */
["NewSource"]: {
	/** Source mime type */
	contentType?:string,
	/** Source checksum */
	checksum?:string,
	/** source file name */
	filename?:string,
	/** Length of source in bytes */
	contentLength?:number
}
  }

export type ModelTypes = {
    /** RFC3339Date is a RFC3339 formated date-time string */
["RFC3339Date"]:any;
	/** Connection object containing list of faker sources */
["FakerSourceConnection"]: {
		/** Connection pageInfo */
	pageInfo:ModelTypes["PageInfo"],
	/** List of sources returned by connection */
	sources?:ModelTypes["FakerSource"][]
};
	/** type object node */
["ProjectOps"]: {
		/** Create project in cloud */
	createCloudDeployment:string,
	/** Boolean object node */
	delete?:boolean,
	/** Deploy code to the project in cloud */
	deployCodeToCloud:string,
	/** deploy project to faker */
	deployToFaker?:boolean,
	/** remove files from project */
	removeSources?:boolean,
	/** rename files in project */
	renameSources?:boolean,
	/** Boolean object node */
	update?:boolean
};
	/** Update project payload */
["UpdateProject"]: GraphQLTypes["UpdateProject"];
	/** Teams connection */
["TeamConnection"]: {
		/** Pagination info used in next fetch */
	pageInfo:ModelTypes["PageInfo"],
	/** List of teams returned by current page in connection */
	teams?:ModelTypes["Team"][]
};
	/** Team object */
["Team"]: {
		/** Unique team id */
	id?:string,
	/** type object node */
	member?:ModelTypes["Member"],
	/** Paginated list of members in team */
	members?:ModelTypes["MemberConnection"],
	/** Team name */
	name:string,
	/** Team's namespace */
	namespace:ModelTypes["Namespace"],
	/** A plan ID of a plan associated with team */
	planID?:number
};
	/** Project connection object

Used with paginated listing of projects */
["ProjectConnection"]: {
		/** Current connection page info */
	pageInfo:ModelTypes["PageInfo"],
	/** List of projects in connection */
	projects?:ModelTypes["Project"][]
};
	["Subscription"]: {
		/** Cancel subscription URL */
	cancelURL?:string,
	/** Subscription expiration date */
	expiration?:string,
	/** Number of seats in subscription */
	quantity?:number,
	/** List of seats in subscription */
	seats?:ModelTypes["UserConnection"],
	/** Status of subscription */
	status?:string,
	/** Subscription unique id */
	subscriptionID?:number,
	/** Subscription plan unique id */
	subscriptionPlanID?:number,
	/** Update subscription URL */
	updateURL?:string
};
	["ChangeSubscriptionInput"]: GraphQLTypes["ChangeSubscriptionInput"];
	/** ProjectsSortInput defines how projects from listProjects should be sorted. */
["ProjectsSortInput"]: GraphQLTypes["ProjectsSortInput"];
	["UserConnection"]: {
		/** Current connection page info */
	pageInfo:ModelTypes["PageInfo"],
	/** List of projects in connection */
	users?:ModelTypes["User"][]
};
	/** Team operations */
["TeamOps"]: {
		/** Add member to the team */
	addMember?:ModelTypes["Member"],
	/** Create new team project */
	createProject?:ModelTypes["Project"],
	/** Delete team */
	delete?:boolean,
	/** Unique team id */
	id?:string,
	/** type object node */
	member?:ModelTypes["MemberOps"],
	/** Paginated list of members in team */
	members?:ModelTypes["MemberConnection"],
	/** Team name */
	name?:string,
	/** Team's namespace */
	namespace?:ModelTypes["Namespace"],
	/** A plan ID of a plan associated with team */
	planID?:number,
	/** type object node */
	project?:ModelTypes["ProjectOps"]
};
	["RenameFileInput"]: GraphQLTypes["RenameFileInput"];
	/** Team member role */
["Role"]: GraphQLTypes["Role"];
	/** Team member ops */
["MemberOps"]: {
		/** Boolean object node */
	delete?:boolean,
	/** Boolean object node */
	update?:boolean
};
	/** Paginated members list */
["MemberConnection"]: {
		/** List of members in this connection */
	members?:ModelTypes["Member"][],
	/** pageInfo for member connection */
	pageInfo:ModelTypes["PageInfo"]
};
	["FileServerCredentials"]:any;
	/** A source object */
["FakerSource"]: {
		/** File checksum */
	checksum?:string,
	contents?:string,
	/** Name of source file */
	filename?:string,
	/** Return an url by which source file can be accessed */
	getUrl?:string
};
	/** Team member */
["Member"]: {
		/** Member email */
	email?:string,
	/** Member role */
	role?:ModelTypes["Role"],
	/** Member username */
	username?:string
};
	["SubscriptionConnection"]: {
		/** Current conenction page info */
	pageInfo:ModelTypes["PageInfo"],
	/** List of subscriptions in connection */
	subscriptions?:ModelTypes["Subscription"][]
};
	/** Checkout data needed to begin payment process */
["PredictCheckoutInput"]: GraphQLTypes["PredictCheckoutInput"];
	["DeployCodeToCloudURIKind"]: GraphQLTypes["DeployCodeToCloudURIKind"];
	["Payment"]: {
		/** Amount paid */
	amount?:ModelTypes["Decimal"],
	/** Currency in which payment was made */
	currency?:string,
	/** Date indicates a when the payment was made */
	date?:ModelTypes["PaymentDate"],
	/** URL from which user can download invoice */
	receiptURL?:string,
	/** ID of subscription for which payment was made */
	subscriptionID?:number
};
	/** Amount is a number that gives precise representation of real numbers */
["Decimal"]:any;
	["DeployCodeToCloudEnv"]: GraphQLTypes["DeployCodeToCloudEnv"];
	/** Namespace is a root object containing projects belonging
to a team or user */
["Namespace"]: {
		/** Return project by name from namespace */
	project?:ModelTypes["Project"],
	/** Returns a project connection object which contains a projects belonging to namespace

last is a string returned by previous call to Namespace.projects

limit sets a limit on how many objects can be returned */
	projects?:ModelTypes["ProjectConnection"],
	/** True if namespace is public */
	public?:boolean,
	/** Namespace part of the slug */
	slug?:string
};
	/** Endpoint returnes a full path to the project without host */
["Endpoint"]: {
		/** Full project uri without host */
	uri?:string
};
	/** Editor user */
["User"]: {
		/** User's account type */
	accountType:ModelTypes["AccountType"],
	/** Unique user id */
	id?:string,
	/** User's namespace */
	namespace?:ModelTypes["Namespace"],
	/** User's subscriptions */
	subscriptions?:ModelTypes["SubscriptionConnection"],
	/** Unique username */
	username?:string
};
	/** Vat information of a user */
["VatInput"]: GraphQLTypes["VatInput"];
	["DeployCodeToCloudInput"]: GraphQLTypes["DeployCodeToCloudInput"];
	/** Root query type */
["Query"]: {
		/** Data needed by the current user to start payment flow */
	checkoutData?:string,
	/** Returns true if the user is logged in and has verified email */
	emailVerified?:boolean,
	/** Returns credentials to file server. If project ID is not provided returns a 
credentials that grants access to all projects owned by user, otherwise creates a
credentials that grants access to one project only if the project is public or
belongs to a user. */
	fileServerCredentials?:ModelTypes["FileServerCredentials"],
	/** Returns a project connection

query is a regular expresion matched agains project slug

last is an id of the last project returned by previous call

limit limits the number of returned projects */
	findProjects?:ModelTypes["ProjectConnection"],
	/** Find projects which contain tag

tag is a string

last is an id of the last project returned by previous call

limit limits the number of returned projects */
	findProjectsByTag?:ModelTypes["ProjectConnection"],
	/** Return namespace matching slug */
	getNamespace?:ModelTypes["Namespace"],
	/** Return project by id */
	getProject?:ModelTypes["Project"],
	/** Return team by name */
	getTeam?:ModelTypes["Team"],
	/** Return user by name */
	getUser?:ModelTypes["User"],
	/** Returns a project connection

If owned is true, returns only project belonging to currently logged user

last is an id of the last project returned by previous call

limit limits the number of returned projects */
	listProjects?:ModelTypes["ProjectConnection"],
	/** List of current user teams */
	myTeams?:ModelTypes["TeamConnection"],
	/** List user payments */
	payments?:(ModelTypes["Payment"] | undefined)[],
	/** Calculate checkout information */
	predictCheckout?:ModelTypes["PredictCheckout"]
};
	/** PageInfo contains information about connection page */
["PageInfo"]: {
		/** last element in connection */
	last?:string,
	/** limit set while quering */
	limit?:number,
	/** if next is false then client recieved all available data */
	next?:boolean
};
	/** Sort order defines possible ordering of sorted outputs */
["SortOrder"]: GraphQLTypes["SortOrder"];
	/** Customer data for checkout information */
["CustomerInput"]: GraphQLTypes["CustomerInput"];
	["Secret"]: GraphQLTypes["Secret"];
	/** Request header */
["Header"]: {
		/** Header name */
	key:string,
	/** Header value */
	value?:string
};
	/** Project type */
["Project"]: {
		/** Return creation time stamp of a project */
	createdAt?:ModelTypes["RFC3339Date"],
	/** Project description */
	description?:string,
	/** Is project enabled */
	enabled?:boolean,
	/** Project endpoint contains a slug under which project can be reached

For example https://app.graphqleditor.com/{endpoint.uri}/ */
	endpoint?:ModelTypes["Endpoint"],
	/** Unique project id */
	id:string,
	/** Is project deployed to cloud */
	inCloud?:boolean,
	/** Is project mocked by faker backend */
	mocked?:boolean,
	/** Project name */
	name:string,
	/** Project owner

Can be null if project belongs to a team */
	owner?:ModelTypes["User"],
	/** True if project is public */
	public?:boolean,
	/** Project part of the slug */
	slug?:string,
	/** Returns a connection object with source files in project

last is a string returned by previous call to Project.sources

limit sets a limit on how many objects can be returned */
	sources?:ModelTypes["FakerSourceConnection"],
	/** Project tags */
	tags?:string[],
	/** Team to which project belongs

Can be null if project belongs to a user */
	team?:ModelTypes["Team"]
};
	/** PredictCheckout represents payment prediction for checkout data */
["PredictCheckout"]: {
		/** Predicted checkout price */
	price:number,
	/** Predicted number of trial days */
	trialDays?:number
};
	/** PaymentDate is a string in a format 'YYYY-MM-DD' */
["PaymentDate"]:any;
	["Mutation"]: {
		/** Changes subscription settings for user */
	changeSubscription?:boolean,
	/** Create project in cloud */
	createCloudDeployment:string,
	/** Create new user project

public if true project is public

name is project name */
	createProject:ModelTypes["Project"],
	/** Create new team */
	createTeam?:ModelTypes["TeamOps"],
	/** Create new user

namespace name for a user

public is user namespace public */
	createUser:ModelTypes["User"],
	/** Delete account */
	deleteAccount?:boolean,
	/** Deploy code to the project in cloud */
	deployCodeToCloud:string,
	/** deploy project to faker */
	deployToFaker?:boolean,
	/** Remove project by id */
	removeProject?:boolean,
	/** Synhronises the target project with source. It overrides existing files
of target with files of sources. It does not remove files from target that do not
exist in source. */
	sync?:boolean,
	/** type object node */
	team?:ModelTypes["TeamOps"],
	/** Modify project */
	updateProject?:boolean,
	/** Add sources to the project */
	updateSources?:(ModelTypes["SourceUploadInfo"] | undefined)[]
};
	["DeployCodeToCloudNode14Opts"]: GraphQLTypes["DeployCodeToCloudNode14Opts"];
	/** Source upload info object */
["SourceUploadInfo"]: {
		/** Source file name */
	filename?:string,
	/** List of headers that must be included in PUT request */
	headers?:(ModelTypes["Header"] | undefined)[],
	/** String with url used in PUT request */
	putUrl:string
};
	/** Defines user's account type */
["AccountType"]: GraphQLTypes["AccountType"];
	/** Checkout data needed to begin payment process */
["CheckoutDataInput"]: GraphQLTypes["CheckoutDataInput"];
	/** New source payload */
["NewSource"]: GraphQLTypes["NewSource"]
    }

export type GraphQLTypes = {
    /** RFC3339Date is a RFC3339 formated date-time string */
["RFC3339Date"]:any;
	/** Connection object containing list of faker sources */
["FakerSourceConnection"]: {
	__typename: "FakerSourceConnection",
	/** Connection pageInfo */
	pageInfo: GraphQLTypes["PageInfo"],
	/** List of sources returned by connection */
	sources?: Array<GraphQLTypes["FakerSource"]>
};
	/** type object node */
["ProjectOps"]: {
	__typename: "ProjectOps",
	/** Create project in cloud */
	createCloudDeployment: string,
	/** Boolean object node */
	delete?: boolean,
	/** Deploy code to the project in cloud */
	deployCodeToCloud: string,
	/** deploy project to faker */
	deployToFaker?: boolean,
	/** remove files from project */
	removeSources?: boolean,
	/** rename files in project */
	renameSources?: boolean,
	/** Boolean object node */
	update?: boolean
};
	/** Update project payload */
["UpdateProject"]: {
		/** ID of project to be updated */
	project?: string,
	/** New description for project */
	description?: string,
	/** List of tags for project */
	tags?: Array<string>,
	/** Set project visiblity */
	public?: boolean
};
	/** Teams connection */
["TeamConnection"]: {
	__typename: "TeamConnection",
	/** Pagination info used in next fetch */
	pageInfo: GraphQLTypes["PageInfo"],
	/** List of teams returned by current page in connection */
	teams?: Array<GraphQLTypes["Team"]>
};
	/** Team object */
["Team"]: {
	__typename: "Team",
	/** Unique team id */
	id?: string,
	/** type object node */
	member?: GraphQLTypes["Member"],
	/** Paginated list of members in team */
	members?: GraphQLTypes["MemberConnection"],
	/** Team name */
	name: string,
	/** Team's namespace */
	namespace: GraphQLTypes["Namespace"],
	/** A plan ID of a plan associated with team */
	planID?: number
};
	/** Project connection object

Used with paginated listing of projects */
["ProjectConnection"]: {
	__typename: "ProjectConnection",
	/** Current connection page info */
	pageInfo: GraphQLTypes["PageInfo"],
	/** List of projects in connection */
	projects?: Array<GraphQLTypes["Project"]>
};
	["Subscription"]: {
	__typename: "Subscription",
	/** Cancel subscription URL */
	cancelURL?: string,
	/** Subscription expiration date */
	expiration?: string,
	/** Number of seats in subscription */
	quantity?: number,
	/** List of seats in subscription */
	seats?: GraphQLTypes["UserConnection"],
	/** Status of subscription */
	status?: string,
	/** Subscription unique id */
	subscriptionID?: number,
	/** Subscription plan unique id */
	subscriptionPlanID?: number,
	/** Update subscription URL */
	updateURL?: string
};
	["ChangeSubscriptionInput"]: {
		subscriptionID: number,
	subscriptionPlanID?: number
};
	/** ProjectsSortInput defines how projects from listProjects should be sorted. */
["ProjectsSortInput"]: {
		/** Sort projects by creation date */
	createdAt?: GraphQLTypes["SortOrder"],
	/** Sort by name */
	name?: GraphQLTypes["SortOrder"],
	/** Sort by id */
	id?: GraphQLTypes["SortOrder"],
	/** Sort by owner */
	owner?: GraphQLTypes["SortOrder"],
	/** Sort by visisbility */
	public?: GraphQLTypes["SortOrder"],
	/** Sort by slug */
	slug?: GraphQLTypes["SortOrder"],
	/** Sort by tag */
	tags?: GraphQLTypes["SortOrder"],
	/** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
	team?: GraphQLTypes["SortOrder"]
};
	["UserConnection"]: {
	__typename: "UserConnection",
	/** Current connection page info */
	pageInfo: GraphQLTypes["PageInfo"],
	/** List of projects in connection */
	users?: Array<GraphQLTypes["User"]>
};
	/** Team operations */
["TeamOps"]: {
	__typename: "TeamOps",
	/** Add member to the team */
	addMember?: GraphQLTypes["Member"],
	/** Create new team project */
	createProject?: GraphQLTypes["Project"],
	/** Delete team */
	delete?: boolean,
	/** Unique team id */
	id?: string,
	/** type object node */
	member?: GraphQLTypes["MemberOps"],
	/** Paginated list of members in team */
	members?: GraphQLTypes["MemberConnection"],
	/** Team name */
	name?: string,
	/** Team's namespace */
	namespace?: GraphQLTypes["Namespace"],
	/** A plan ID of a plan associated with team */
	planID?: number,
	/** type object node */
	project?: GraphQLTypes["ProjectOps"]
};
	["RenameFileInput"]: {
		dst: string,
	src: string
};
	/** Team member role */
["Role"]: Role;
	/** Team member ops */
["MemberOps"]: {
	__typename: "MemberOps",
	/** Boolean object node */
	delete?: boolean,
	/** Boolean object node */
	update?: boolean
};
	/** Paginated members list */
["MemberConnection"]: {
	__typename: "MemberConnection",
	/** List of members in this connection */
	members?: Array<GraphQLTypes["Member"]>,
	/** pageInfo for member connection */
	pageInfo: GraphQLTypes["PageInfo"]
};
	["FileServerCredentials"]:any;
	/** A source object */
["FakerSource"]: {
	__typename: "FakerSource",
	/** File checksum */
	checksum?: string,
	contents?: string,
	/** Name of source file */
	filename?: string,
	/** Return an url by which source file can be accessed */
	getUrl?: string
};
	/** Team member */
["Member"]: {
	__typename: "Member",
	/** Member email */
	email?: string,
	/** Member role */
	role?: GraphQLTypes["Role"],
	/** Member username */
	username?: string
};
	["SubscriptionConnection"]: {
	__typename: "SubscriptionConnection",
	/** Current conenction page info */
	pageInfo: GraphQLTypes["PageInfo"],
	/** List of subscriptions in connection */
	subscriptions?: Array<GraphQLTypes["Subscription"]>
};
	/** Checkout data needed to begin payment process */
["PredictCheckoutInput"]: {
		/** Quantity of subscriptions that user wants */
	quantity?: number,
	/** Optional discount coupon */
	coupon?: string,
	/** An id of a chosen subscription plan */
	planID: string
};
	["DeployCodeToCloudURIKind"]: DeployCodeToCloudURIKind;
	["Payment"]: {
	__typename: "Payment",
	/** Amount paid */
	amount?: GraphQLTypes["Decimal"],
	/** Currency in which payment was made */
	currency?: string,
	/** Date indicates a when the payment was made */
	date?: GraphQLTypes["PaymentDate"],
	/** URL from which user can download invoice */
	receiptURL?: string,
	/** ID of subscription for which payment was made */
	subscriptionID?: number
};
	/** Amount is a number that gives precise representation of real numbers */
["Decimal"]:any;
	["DeployCodeToCloudEnv"]: DeployCodeToCloudEnv;
	/** Namespace is a root object containing projects belonging
to a team or user */
["Namespace"]: {
	__typename: "Namespace",
	/** Return project by name from namespace */
	project?: GraphQLTypes["Project"],
	/** Returns a project connection object which contains a projects belonging to namespace

last is a string returned by previous call to Namespace.projects

limit sets a limit on how many objects can be returned */
	projects?: GraphQLTypes["ProjectConnection"],
	/** True if namespace is public */
	public?: boolean,
	/** Namespace part of the slug */
	slug?: string
};
	/** Endpoint returnes a full path to the project without host */
["Endpoint"]: {
	__typename: "Endpoint",
	/** Full project uri without host */
	uri?: string
};
	/** Editor user */
["User"]: {
	__typename: "User",
	/** User's account type */
	accountType: GraphQLTypes["AccountType"],
	/** Unique user id */
	id?: string,
	/** User's namespace */
	namespace?: GraphQLTypes["Namespace"],
	/** User's subscriptions */
	subscriptions?: GraphQLTypes["SubscriptionConnection"],
	/** Unique username */
	username?: string
};
	/** Vat information of a user */
["VatInput"]: {
		/** Vat number */
	number?: string,
	/** Vat company name */
	companyName?: string,
	/** Vat company street address */
	street?: string,
	/** Vat company city address */
	city?: string,
	/** Vat company state address. Optional. */
	state?: string,
	/** Vat company country address. */
	country?: string,
	/** Vat company post code address. */
	postCode?: string
};
	["DeployCodeToCloudInput"]: {
		codeURI: string,
	kind?: GraphQLTypes["DeployCodeToCloudURIKind"],
	env?: GraphQLTypes["DeployCodeToCloudEnv"],
	secrets?: Array<GraphQLTypes["Secret"]>,
	node14Opts?: GraphQLTypes["DeployCodeToCloudNode14Opts"]
};
	/** Root query type */
["Query"]: {
	__typename: "Query",
	/** Data needed by the current user to start payment flow */
	checkoutData?: string,
	/** Returns true if the user is logged in and has verified email */
	emailVerified?: boolean,
	/** Returns credentials to file server. If project ID is not provided returns a 
credentials that grants access to all projects owned by user, otherwise creates a
credentials that grants access to one project only if the project is public or
belongs to a user. */
	fileServerCredentials?: GraphQLTypes["FileServerCredentials"],
	/** Returns a project connection

query is a regular expresion matched agains project slug

last is an id of the last project returned by previous call

limit limits the number of returned projects */
	findProjects?: GraphQLTypes["ProjectConnection"],
	/** Find projects which contain tag

tag is a string

last is an id of the last project returned by previous call

limit limits the number of returned projects */
	findProjectsByTag?: GraphQLTypes["ProjectConnection"],
	/** Return namespace matching slug */
	getNamespace?: GraphQLTypes["Namespace"],
	/** Return project by id */
	getProject?: GraphQLTypes["Project"],
	/** Return team by name */
	getTeam?: GraphQLTypes["Team"],
	/** Return user by name */
	getUser?: GraphQLTypes["User"],
	/** Returns a project connection

If owned is true, returns only project belonging to currently logged user

last is an id of the last project returned by previous call

limit limits the number of returned projects */
	listProjects?: GraphQLTypes["ProjectConnection"],
	/** List of current user teams */
	myTeams?: GraphQLTypes["TeamConnection"],
	/** List user payments */
	payments?: Array<GraphQLTypes["Payment"] | undefined>,
	/** Calculate checkout information */
	predictCheckout?: GraphQLTypes["PredictCheckout"]
};
	/** PageInfo contains information about connection page */
["PageInfo"]: {
	__typename: "PageInfo",
	/** last element in connection */
	last?: string,
	/** limit set while quering */
	limit?: number,
	/** if next is false then client recieved all available data */
	next?: boolean
};
	/** Sort order defines possible ordering of sorted outputs */
["SortOrder"]: SortOrder;
	/** Customer data for checkout information */
["CustomerInput"]: {
		/** User's post code */
	postCode?: string,
	/** Must be true for marketing to be allowed */
	marketingConsent?: boolean,
	/** User's email address */
	email?: string,
	/** User's country */
	country?: string
};
	["Secret"]: {
		name: string,
	value?: string
};
	/** Request header */
["Header"]: {
	__typename: "Header",
	/** Header name */
	key: string,
	/** Header value */
	value?: string
};
	/** Project type */
["Project"]: {
	__typename: "Project",
	/** Return creation time stamp of a project */
	createdAt?: GraphQLTypes["RFC3339Date"],
	/** Project description */
	description?: string,
	/** Is project enabled */
	enabled?: boolean,
	/** Project endpoint contains a slug under which project can be reached

For example https://app.graphqleditor.com/{endpoint.uri}/ */
	endpoint?: GraphQLTypes["Endpoint"],
	/** Unique project id */
	id: string,
	/** Is project deployed to cloud */
	inCloud?: boolean,
	/** Is project mocked by faker backend */
	mocked?: boolean,
	/** Project name */
	name: string,
	/** Project owner

Can be null if project belongs to a team */
	owner?: GraphQLTypes["User"],
	/** True if project is public */
	public?: boolean,
	/** Project part of the slug */
	slug?: string,
	/** Returns a connection object with source files in project

last is a string returned by previous call to Project.sources

limit sets a limit on how many objects can be returned */
	sources?: GraphQLTypes["FakerSourceConnection"],
	/** Project tags */
	tags?: Array<string>,
	/** Team to which project belongs

Can be null if project belongs to a user */
	team?: GraphQLTypes["Team"]
};
	/** PredictCheckout represents payment prediction for checkout data */
["PredictCheckout"]: {
	__typename: "PredictCheckout",
	/** Predicted checkout price */
	price: number,
	/** Predicted number of trial days */
	trialDays?: number
};
	/** PaymentDate is a string in a format 'YYYY-MM-DD' */
["PaymentDate"]:any;
	["Mutation"]: {
	__typename: "Mutation",
	/** Changes subscription settings for user */
	changeSubscription?: boolean,
	/** Create project in cloud */
	createCloudDeployment: string,
	/** Create new user project

public if true project is public

name is project name */
	createProject: GraphQLTypes["Project"],
	/** Create new team */
	createTeam?: GraphQLTypes["TeamOps"],
	/** Create new user

namespace name for a user

public is user namespace public */
	createUser: GraphQLTypes["User"],
	/** Delete account */
	deleteAccount?: boolean,
	/** Deploy code to the project in cloud */
	deployCodeToCloud: string,
	/** deploy project to faker */
	deployToFaker?: boolean,
	/** Remove project by id */
	removeProject?: boolean,
	/** Synhronises the target project with source. It overrides existing files
of target with files of sources. It does not remove files from target that do not
exist in source. */
	sync?: boolean,
	/** type object node */
	team?: GraphQLTypes["TeamOps"],
	/** Modify project */
	updateProject?: boolean,
	/** Add sources to the project */
	updateSources?: Array<GraphQLTypes["SourceUploadInfo"] | undefined>
};
	["DeployCodeToCloudNode14Opts"]: {
		buildScript?: string
};
	/** Source upload info object */
["SourceUploadInfo"]: {
	__typename: "SourceUploadInfo",
	/** Source file name */
	filename?: string,
	/** List of headers that must be included in PUT request */
	headers?: Array<GraphQLTypes["Header"] | undefined>,
	/** String with url used in PUT request */
	putUrl: string
};
	/** Defines user's account type */
["AccountType"]: AccountType;
	/** Checkout data needed to begin payment process */
["CheckoutDataInput"]: {
		/** An id of a chosen subscription plan */
	planID: string,
	/** Quantity of subscriptions that user wants */
	quantity?: number,
	/** Customer data */
	customer?: GraphQLTypes["CustomerInput"],
	/** Vat data */
	vat?: GraphQLTypes["VatInput"],
	/** Optional discount coupon */
	coupon?: string,
	/** URL to which user should be redirected after successful transaction */
	successURL?: string,
	/** URL to which user should be redirected after failed transaction */
	cancelURL?: string
};
	/** New source payload */
["NewSource"]: {
		/** Source mime type */
	contentType?: string,
	/** Source checksum */
	checksum?: string,
	/** source file name */
	filename?: string,
	/** Length of source in bytes */
	contentLength?: number
}
    }
/** Team member role */
export enum Role {
	EDITOR = "EDITOR",
	VIEWER = "VIEWER",
	CONTRIBUTOR = "CONTRIBUTOR",
	OWNER = "OWNER",
	ADMIN = "ADMIN"
}
export enum DeployCodeToCloudURIKind {
	ZIP = "ZIP",
	PROJECT_FILES = "PROJECT_FILES"
}
export enum DeployCodeToCloudEnv {
	NODE14 = "NODE14"
}
/** Sort order defines possible ordering of sorted outputs */
export enum SortOrder {
	Ascending = "Ascending",
	Descending = "Descending"
}
/** Defines user's account type */
export enum AccountType {
	PREMIUM = "PREMIUM",
	FREE = "FREE"
}
export class GraphQLError extends Error {
    constructor(public response: GraphQLResponse) {
      super("");
      console.error(response);
    }
    toString() {
      return "GraphQL Response Error";
    }
  }


export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<
  UnwrapPromise<ReturnType<T>>
>;
export type ZeusHook<
  T extends (
    ...args: any[]
  ) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>
> = ZeusState<ReturnType<T>[N]>;

type WithTypeNameValue<T> = T & {
  __typename?: true;
};
type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
type IsArray<T, U> = T extends Array<infer R> ? InputType<R, U>[] : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;

type NotUnionTypes<SRC extends DeepAnify<DST>, DST> = {
  [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
}[keyof DST];

type ExtractUnions<SRC extends DeepAnify<DST>, DST> = {
  [P in keyof SRC]: SRC[P] extends '__union' & infer R
    ? P extends keyof DST
      ? IsArray<R, DST[P] & { __typename: true }>
      : {}
    : never;
}[keyof SRC];

type IsInterfaced<SRC extends DeepAnify<DST>, DST> = FlattenArray<SRC> extends ZEUS_INTERFACES | ZEUS_UNIONS
  ? ExtractUnions<SRC, DST> &
      {
        [P in keyof Omit<Pick<SRC, NotUnionTypes<SRC, DST>>, '__typename'>]: DST[P] extends true
          ? SRC[P]
          : IsArray<SRC[P], DST[P]>;
      }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends true ? SRC[P] : IsArray<SRC[P], DST[P]>;
    };



export type MapType<SRC, DST> = SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST> : never;
type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P]>;
    } &
      MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
  : MapType<SRC, IsPayLoad<DST>>;
type Func<P extends any[], R> = (...args: P) => R;
type AnyFunc = Func<any, any>;
export type ArgsType<F extends AnyFunc> = F extends Func<infer P, any> ? P : never;
export type OperationToGraphQL<V, T> = <Z extends V>(o: Z | V, variables?: Record<string, any>) => Promise<InputType<T, Z>>;
export type SubscriptionToGraphQL<V, T> = <Z extends V>(
  o: Z | V,
  variables?: Record<string, any>,
) => {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z>) => void) => void;
  off: (e: { data?: InputType<T, Z>; code?: number; reason?: string; message?: string }) => void;
  error: (e: { data?: InputType<T, Z>; message?: string }) => void;
  open: () => void;
};
export type CastToGraphQL<V, T> = (resultOfYourQuery: any) => <Z extends V>(o: Z | V) => InputType<T, Z>;
export type SelectionFunction<V> = <T>(t: T | V) => T;
export type fetchOptions = ArgsType<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (
  ...args: infer R
) => WebSocket
  ? R
  : never;
export type chainOptions =
  | [fetchOptions[0], fetchOptions[1] & {websocket?: websocketOptions}]
  | [fetchOptions[0]];
export type FetchFunction = (
  query: string,
  variables?: Record<string, any>,
) => Promise<any>;
export type SubscriptionFunction = (
  query: string,
  variables?: Record<string, any>,
) => void;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;



export const ZeusSelect = <T>() => ((t: any) => t) as SelectionFunction<T>;

export const ScalarResolver = (scalar: string, value: any) => {
  switch (scalar) {
    case 'String':
      return  `${JSON.stringify(value)}`;
    case 'Int':
      return `${value}`;
    case 'Float':
      return `${value}`;
    case 'Boolean':
      return `${value}`;
    case 'ID':
      return `"${value}"`;
    case 'enum':
      return `${value}`;
    case 'scalar':
      return `${value}`;
    default:
      return false;
  }
};


export const TypesPropsResolver = ({
    value,
    type,
    name,
    key,
    blockArrays
}: {
    value: any;
    type: string;
    name: string;
    key?: string;
    blockArrays?: boolean;
}): string => {
    if (value === null) {
        return `null`;
    }
    let resolvedValue = AllTypesProps[type][name];
    if (key) {
        resolvedValue = resolvedValue[key];
    }
    if (!resolvedValue) {
        throw new Error(`Cannot resolve ${type} ${name}${key ? ` ${key}` : ''}`)
    }
    const typeResolved = resolvedValue.type;
    const isArray = resolvedValue.array;
    const isArrayRequired = resolvedValue.arrayRequired;
    if (typeof value === 'string' && value.startsWith(`ZEUS_VAR$`)) {
        const isRequired = resolvedValue.required ? '!' : '';
        let t = `${typeResolved}`;
        if (isArray) {
          if (isRequired) {
              t = `${t}!`;
          }
          t = `[${t}]`;
          if(isArrayRequired){
            t = `${t}!`;
          }
        }else{
          if (isRequired) {
                t = `${t}!`;
          }
        }
        return `\$${value.split(`ZEUS_VAR$`)[1]}__ZEUS_VAR__${t}`;
    }
    if (isArray && !blockArrays) {
        return `[${value
        .map((v: any) => TypesPropsResolver({ value: v, type, name, key, blockArrays: true }))
        .join(',')}]`;
    }
    const reslovedScalar = ScalarResolver(typeResolved, value);
    if (!reslovedScalar) {
        const resolvedType = AllTypesProps[typeResolved];
        if (typeof resolvedType === 'object') {
        const argsKeys = Object.keys(resolvedType);
        return `{${argsKeys
            .filter((ak) => value[ak] !== undefined)
            .map(
            (ak) => `${ak}:${TypesPropsResolver({ value: value[ak], type: typeResolved, name: ak })}`
            )}}`;
        }
        return ScalarResolver(AllTypesProps[typeResolved], value) as string;
    }
    return reslovedScalar;
};


const isArrayFunction = (
  parent: string[],
  a: any[]
) => {
  const [values, r] = a;
  const [mainKey, key, ...keys] = parent;
  const keyValues = Object.keys(values).filter((k) => typeof values[k] !== 'undefined');

  if (!keys.length) {
      return keyValues.length > 0
        ? `(${keyValues
            .map(
              (v) =>
                `${v}:${TypesPropsResolver({
                  value: values[v],
                  type: mainKey,
                  name: key,
                  key: v
                })}`
            )
            .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
        : traverseToSeekArrays(parent, r);
    }

  const [typeResolverKey] = keys.splice(keys.length - 1, 1);
  let valueToResolve = ReturnTypes[mainKey][key];
  for (const k of keys) {
    valueToResolve = ReturnTypes[valueToResolve][k];
  }

  const argumentString =
    keyValues.length > 0
      ? `(${keyValues
          .map(
            (v) =>
              `${v}:${TypesPropsResolver({
                value: values[v],
                type: valueToResolve,
                name: typeResolverKey,
                key: v
              })}`
          )
          .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
      : traverseToSeekArrays(parent, r);
  return argumentString;
};


const resolveKV = (k: string, v: boolean | string | { [x: string]: boolean | string }) =>
  typeof v === 'boolean' ? k : typeof v === 'object' ? `${k}{${objectToTree(v)}}` : `${k}${v}`;


const objectToTree = (o: { [x: string]: boolean | string }): string =>
  `{${Object.keys(o).map((k) => `${resolveKV(k, o[k])}`).join(' ')}}`;


const traverseToSeekArrays = (parent: string[], a?: any): string => {
  if (!a) return '';
  if (Object.keys(a).length === 0) {
    return '';
  }
  let b: Record<string, any> = {};
  if (Array.isArray(a)) {
    return isArrayFunction([...parent], a);
  } else {
    if (typeof a === 'object') {
      Object.keys(a)
        .filter((k) => typeof a[k] !== 'undefined')
        .map((k) => {
        if (k === '__alias') {
          Object.keys(a[k]).map((aliasKey) => {
            const aliasOperations = a[k][aliasKey];
            const aliasOperationName = Object.keys(aliasOperations)[0];
            const aliasOperation = aliasOperations[aliasOperationName];
            b[
              `${aliasOperationName}__alias__${aliasKey}: ${aliasOperationName}`
            ] = traverseToSeekArrays([...parent, aliasOperationName], aliasOperation);
          });
        } else {
          b[k] = traverseToSeekArrays([...parent, k], a[k]);
        }
      });
    } else {
      return '';
    }
  }
  return objectToTree(b);
};  


const buildQuery = (type: string, a?: Record<any, any>) => 
  traverseToSeekArrays([type], a);


const inspectVariables = (query: string) => {
  const regex = /\$\b\w*__ZEUS_VAR__\[?[^!^\]^\s^,^\)^\}]*[!]?[\]]?[!]?/g;
  let result;
  const AllVariables: string[] = [];
  while ((result = regex.exec(query))) {
    if (AllVariables.includes(result[0])) {
      continue;
    }
    AllVariables.push(result[0]);
  }
  if (!AllVariables.length) {
    return query;
  }
  let filteredQuery = query;
  AllVariables.forEach((variable) => {
    while (filteredQuery.includes(variable)) {
      filteredQuery = filteredQuery.replace(variable, variable.split('__ZEUS_VAR__')[0]);
    }
  });
  return `(${AllVariables.map((a) => a.split('__ZEUS_VAR__'))
    .map(([variableName, variableType]) => `${variableName}:${variableType}`)
    .join(', ')})${filteredQuery}`;
};


export const queryConstruct = (t: 'query' | 'mutation' | 'subscription', tName: string) => (o: Record<any, any>) =>
  `${t.toLowerCase()}${inspectVariables(buildQuery(tName, o))}`;
  

const fullChainConstruct = (fn: FetchFunction) => (t: 'query' | 'mutation' | 'subscription', tName: string) => (
  o: Record<any, any>,
  variables?: Record<string, any>,
) => fn(queryConstruct(t, tName)(o), variables).then((r:any) => { 
  seekForAliases(r)
  return r
});

export const fullChainConstructor = <F extends FetchFunction, R extends keyof ValueTypes>(
  fn: F,
  operation: 'query' | 'mutation' | 'subscription',
  key: R,
) =>
  ((o, variables) => fullChainConstruct(fn)(operation, key)(o as any, variables)) as OperationToGraphQL<
    ValueTypes[R],
    GraphQLTypes[R]
  >;


const fullSubscriptionConstruct = (fn: SubscriptionFunction) => (
  t: 'query' | 'mutation' | 'subscription',
  tName: string,
) => (o: Record<any, any>, variables?: Record<string, any>) =>
  fn(queryConstruct(t, tName)(o), variables);

export const fullSubscriptionConstructor = <F extends SubscriptionFunction, R extends keyof ValueTypes>(
  fn: F,
  operation: 'query' | 'mutation' | 'subscription',
  key: R,
) =>
  ((o, variables) => fullSubscriptionConstruct(fn)(operation, key)(o as any, variables)) as SubscriptionToGraphQL<
    ValueTypes[R],
    GraphQLTypes[R]
  >;


const seekForAliases = (response: any) => {
  const traverseAlias = (value: any) => {
    if (Array.isArray(value)) {
      value.forEach(seekForAliases);
    } else {
      if (typeof value === 'object') {
        seekForAliases(value);
      }
    }
  };
  if (typeof response === 'object' && response) {
    const keys = Object.keys(response);
    if (keys.length < 1) {
      return;
    }
    keys.forEach((k) => {
      const value = response[k];
      if (k.indexOf('__alias__') !== -1) {
        const [operation, alias] = k.split('__alias__');
        response[alias] = {
          [operation]: value,
        };
        delete response[k];
      }
      traverseAlias(value);
    });
  }
};


export const $ = (t: TemplateStringsArray): any => `ZEUS_VAR$${t.join('')}`;


export const resolverFor = <
  T extends keyof ValueTypes,
  Z extends keyof ValueTypes[T],
  Y extends (
    args: Required<ValueTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> : any
>(
  type: T,
  field: Z,
  fn: Y,
) => fn as (args?: any,source?: any) => any;


const handleFetchResponse = (
  response: Parameters<Extract<Parameters<ReturnType<typeof fetch>['then']>[0], Function>>[0]
): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response.text().then(text => {
        try { reject(JSON.parse(text)); }
        catch (err) { reject(text); }
      }).catch(reject);
    });
  }
  return response.json();
};

export const apiFetch = (options: fetchOptions) => (query: string, variables: Record<string, any> = {}) => {
    let fetchFunction;
    let queryString = query;
    let fetchOptions = options[1] || {};
    try {
        fetchFunction = require('node-fetch');
    } catch (error) {
        throw new Error("Please install 'node-fetch' to use zeus in nodejs environment");
    }
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      try {
          queryString = require('querystring').stringify(query);
      } catch (error) {
          throw new Error("Something gone wrong 'querystring' is a part of nodejs environment");
      }
      return fetchFunction(`${options[0]}?query=${queryString}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetchFunction(`${options[0]}`, {
      body: JSON.stringify({ query: queryString, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };
  

export const apiSubscription = (options: chainOptions) => (
    query: string,
    variables: Record<string, any> = {},
  ) => {
    try {
      const WebSocket =  require('ws');
      const queryString = options[0] + '?query=' + encodeURIComponent(query);
      const wsString = queryString.replace('http', 'ws');
      const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
      const webSocketOptions = options[1]?.websocket || [host];
      const ws = new WebSocket(...webSocketOptions);
      return {
        ws,
        on: (e: (args: any) => void) => {
          ws.onmessage = (event:any) => {
            if(event.data){
              const parsed = JSON.parse(event.data)
              const data = parsed.data
              if (data) {
                seekForAliases(data);
              }
              return e(data);
            }
          };
        },
        off: (e: (args: any) => void) => {
          ws.onclose = e;
        },
        error: (e: (args: any) => void) => {
          ws.onerror = e;
        },
        open: (e: () => void) => {
          ws.onopen = e;
        },
      };
    } catch {
      throw new Error('No websockets implemented. Please install ws');
    }
  };


export const Thunder = (fn: FetchFunction, subscriptionFn: SubscriptionFunction) => ({
  query: fullChainConstructor(fn,'query', 'Query'),
mutation: fullChainConstructor(fn,'mutation', 'Mutation')
});

export const Chain = (...options: chainOptions) => ({
  query: fullChainConstructor(apiFetch(options),'query', 'Query'),
mutation: fullChainConstructor(apiFetch(options),'mutation', 'Mutation')
});
export const Zeus = {
  query: (o:ValueTypes["Query"]) => queryConstruct('query', 'Query')(o),
mutation: (o:ValueTypes["Mutation"]) => queryConstruct('mutation', 'Mutation')(o)
};
export const Cast = {
  query: ((o: any) => (_: any) => o) as CastToGraphQL<
  ValueTypes["Query"],
  GraphQLTypes["Query"]
>,
mutation: ((o: any) => (_: any) => o) as CastToGraphQL<
  ValueTypes["Mutation"],
  GraphQLTypes["Mutation"]
>
};
export const Selectors = {
  query: ZeusSelect<ValueTypes["Query"]>(),
mutation: ZeusSelect<ValueTypes["Mutation"]>()
};
  

export const Gql = Chain('https://api.staging.project.graphqleditor.com/graphql')